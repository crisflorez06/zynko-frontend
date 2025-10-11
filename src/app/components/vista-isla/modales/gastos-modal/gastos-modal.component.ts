import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MensajeService } from '../../../../services/mensaje.service';
import { TurnoIslaStore } from '../../../../store/turno-isla.store';
import { TurnoIslaService } from '../../../../services/isla/turno-isla.service';
import { GastoIslaService } from '../../../../services/isla/gasto-isla.service';
import { Gasto } from '../../../../models/isla/gasto';

@Component({
  selector: 'app-gastos-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gastos-modal.component.html',
  styleUrl: './gastos-modal.component.css',
})
export class GastosModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private gastoService = inject(GastoIslaService);
  private mensajeService = inject(MensajeService);
  private turnoIslaService = inject(TurnoIslaService);
  private store = inject(TurnoIslaStore);
  formularioGasto: FormGroup;
  gastos: Gasto[] = [];
  modoCreacionGasto = false;
  gastoSeleccionado: Gasto | null = null;

  constructor() {
    this.formularioGasto = this.fb.group({
      nombre: ['', [Validators.required]],
      cantidad: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.turnoIslaService.getTurnoActivo().subscribe((turno) => {
      this.store.setTurno(turno);
    });
    this.getGastos();
  }

  getGastos() {
    this.gastoService.getGastosPorTurno().subscribe({
      next: (data: Gasto[]) => {
        this.gastos = data;

        const totalGastos = data.reduce(
          (sum, gasto) => sum + gasto.cantidad,
          0
        );
        this.store.actualizarGastos(totalGastos);
      },
      error: () => {
        this.mensajeService.error('Error al traer los gastos');
      },
    });
  }

  guardarGasto() {
    if (this.formularioGasto.invalid) {
      this.mensajeService.error('Por favor, especifica una cantidad válida');
      return;
    }
    const gasto = this.formularioGasto.value;

    //logica por si es edicion o creacion
    if (this.gastoSeleccionado) {
      const gastoActualizado: Gasto = {
        ...this.gastoSeleccionado,
        ...gasto,
      };
      this.gastoService
        .actualizar(gastoActualizado.id!, gastoActualizado)
        .subscribe({
          next: () => {
            this.mensajeService.success('Gasto actualizado con éxito');
            this.ocultarFormularioGasto();
          },
          error: () => {
            this.mensajeService.error('Error al actualizar el gasto');
          },
        });
    } else {
      // Modo creación
      this.gastoService.crearGasto(gasto).subscribe({
        next: () => {
          this.mensajeService.success('Gasto registrado con éxito');
          this.ocultarFormularioGasto(); // Vuelve a la vista de tabla
        },
        error: (error) => {
          this.mensajeService.error(
            'Error al registrar el gasto: ' + error.message
          );
        },
      });
    }
  }

  editarGasto(gasto: Gasto) {
    this.gastoSeleccionado = gasto;
    this.modoCreacionGasto = true;
    this.formularioGasto.patchValue({
      cantidad: gasto.cantidad,
      nombre: gasto.nombre,
    });
  }

  anularGasto(gasto: Gasto) {
    this.gastoService.anular(gasto.id!).subscribe({
      next: () => {
        this.mensajeService.success('Gasto anulado con éxito');
        this.getGastos();
      },
      error: () => {
        this.mensajeService.error('Error al anular el gasto');
      },
    });
  }

  mostrarFormularioGasto(): void {
    this.gastoSeleccionado = null;
    this.modoCreacionGasto = true;
    this.formularioGasto.reset({ cantidad: 1 });
  }

  ocultarFormularioGasto(): void {
    this.modoCreacionGasto = false;
    this.gastoSeleccionado = null;
    this.formularioGasto.reset({ cantidad: 1 });
    this.getGastos();
  }
}
