import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CreditoIslaService } from '../../../../services/isla/credito-isla.service';
import { MensajeService } from '../../../../services/mensaje.service';
import {
  CreditoRequest,
  CreditoResponse,
  ListarProductosClientes,
} from '../../../../models/isla/credito/credito';
import { TurnoIslaStore } from '../../../../store/turno-isla.store';
import { TurnoIslaService } from '../../../../services/isla/turno-isla.service';
import { cliente } from '../../../../models/isla/credito/cliente';
import { Producto } from '../../../../models/isla/credito/producto';

@Component({
  selector: 'app-creditos-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './creditos-modal.component.html',
  styleUrl: './creditos-modal.component.css',
})
export class CreditosModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private creditoService = inject(CreditoIslaService);
  private mensajeService = inject(MensajeService);
  private turnoIslaService = inject(TurnoIslaService);
  private store = inject(TurnoIslaStore);

  turno$ = this.store.turno$;

  formularioCredito: FormGroup;
  creditos: CreditoResponse[] = [];
  clientes: cliente[] = [];
  productos: Producto[] = [];
  modoCreacionCredito = false;
  creditoSeleccionado: CreditoResponse | null = null;

  // controles auxiliares para autocompletado
  clienteCtrl = new FormControl<cliente | null>(null);
  clientesFiltrados$!: Observable<cliente[]>;
  productosFiltrados$: Observable<Producto[]>[] = [];

  constructor() {
    this.formularioCredito = this.fb.group({
      clienteId: [null, Validators.required],
      placa: [''],
      items: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.turnoIslaService.getTurnoActivo().subscribe((turno) => {
      this.store.setTurno(turno);
    });
    this.getListaProductosClientes();
    this.getCreditos();

    // filtrar clientes en base a lo que se escribe
    this.clientesFiltrados$ = this.clienteCtrl.valueChanges.pipe(
      startWith(null),
      map((value: cliente | string | null) =>
        this.filtrarClientes(
          typeof value === 'string' ? value : value?.nombre ?? ''
        )
      )
    );
  }

  private filtrarClientes(value: string): cliente[] {
    const filterValue = value.toLowerCase();
    return this.clientes.filter((c) =>
      c.nombre.toLowerCase().includes(filterValue)
    );
  }

  private filtrarProductos(value: string): Producto[] {
    const filterValue = value.toLowerCase();
    return this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(filterValue)
    );
  }

  getCreditos(): void {
    this.creditoService.obtenerDelTurnoActivo().subscribe({
      next: (data: CreditoResponse[]) => {
        this.creditos = data;

        const totalCreditos = data.reduce(
          (sum, credito) => sum + credito.total,
          0
        );
        this.store.actualizarCreditos(totalCreditos);
      },
      error: () => {
        this.mensajeService.error('Error al traer los créditos');
      },
    });
  }

  getListaProductosClientes(): void {
    this.creditoService.listarProductosClientes().subscribe({
      next: (data: ListarProductosClientes) => {
        this.clientes = data.clientes;
        this.productos = data.productos;
      },
      error: () => {
        this.mensajeService.error('Error al cargar clientes y productos');
      },
    });
  }

  guardarCredito(): void {
    if (this.formularioCredito.invalid) {
      this.mensajeService.error('Formulario de crédito inválido');
      return;
    }

    const request: CreditoRequest = this.formularioCredito.value;

    if (this.creditoSeleccionado) {
      const creditoActualizado: CreditoRequest = {
        ...this.creditoSeleccionado,
        ...request,
      };
      this.creditoService
        .actualizar(this.creditoSeleccionado.id, creditoActualizado)
        .subscribe({
          next: () => {
            this.mensajeService.success('Crédito actualizado con éxito');
            this.ocultarFormularioCredito();
            this.getCreditos();
          },
          error: () => {
            this.mensajeService.error('Error al actualizar el crédito');
          },
        });
    } else {
      this.creditoService.crearCredito(request).subscribe({
        next: () => {
          this.mensajeService.success('Crédito creado con éxito');
          this.ocultarFormularioCredito();
          this.getCreditos();
        },
        error: (error) => {
          this.mensajeService.error(
            'Error al registrar el crédito: ' + error.message
          );
        },
      });
    }
  }

  get items(): FormArray {
    return this.formularioCredito.get('items') as FormArray;
  }

  nuevoItem(): FormGroup {
    const group = this.fb.group({
      productoId: [null, Validators.required],
      productoCtrl: new FormControl<Producto | null>(null),
      precioVenta: [0, [Validators.required, Validators.min(1)]],
    });

    const index = this.items.length;
    this.productosFiltrados$[index] = group
      .get('productoCtrl')!
      .valueChanges.pipe(
        startWith(null),
        map((value: Producto | string | null) =>
          this.filtrarProductos(
            typeof value === 'string' ? value : value?.nombre ?? ''
          )
        )
      );

    return group;
  }

  agregarItem(): void {
    this.items.push(this.nuevoItem());
  }

  eliminarItem(index: number): void {
    this.items.removeAt(index);
  }

  mostrarFormularioParaEditar(credito: CreditoResponse): void {
    this.creditoSeleccionado = credito;
    this.modoCreacionCredito = true;

    this.formularioCredito.patchValue({
      clienteId: credito.idCliente,
      placa: credito.placa,
    });

    // setear cliente en autocomplete
    const clienteObj =
      this.clientes.find((c) => c.id === credito.idCliente) ?? null;
    this.clienteCtrl.setValue(clienteObj);

    this.items.clear();
    credito.items.forEach((item) => {
      const productoObj =
        this.productos.find((p) => p.id === item.producto.id) ?? null;

      const group = this.fb.group({
        productoId: [item.producto.id, Validators.required],
        productoCtrl: new FormControl<Producto | null>(productoObj),
        precioVenta: [
          item.precioVenta,
          [Validators.required, Validators.min(1)],
        ],
      });

      const index = this.items.length;
      this.productosFiltrados$[index] = group
        .get('productoCtrl')!
        .valueChanges.pipe(
          startWith(productoObj),
          map((value: Producto | string | null) =>
            this.filtrarProductos(
              typeof value === 'string' ? value : value?.nombre ?? ''
            )
          )
        );

      this.items.push(group);
    });
  }

  mostrarFormularioCredito(): void {
    this.creditoSeleccionado = null;
    this.modoCreacionCredito = true;
    this.formularioCredito.reset();
    this.items.clear();
    this.clienteCtrl.reset(null);
  }

  ocultarFormularioCredito(): void {
    this.modoCreacionCredito = false;
    this.creditoSeleccionado = null;
    this.formularioCredito.reset({ items: [] });
    this.items.clear();
    this.clienteCtrl.reset(null); // <<< limpia el cliente
  }

  mostrarCliente(cliente: cliente): string {
    return cliente ? cliente.nombre : '';
  }

  mostrarProducto(producto: Producto): string {
    return producto ? producto.nombre : '';
  }

  anularCredito(credito: CreditoResponse) {
    this.creditoService.eliminarCredito(credito.id!).subscribe({
      next: () => {
        this.mensajeService.success('Tiro anulado con éxito');
        this.getCreditos();
      },
      error: () => {
        this.mensajeService.error('Error al anular el tiro');
      },
    });
  }
}
