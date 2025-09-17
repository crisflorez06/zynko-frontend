import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TiroService } from '../../../services/tiro.service';
import { MensajeService } from '../../../services/mensaje.service';
import { Tiro } from '../../../models/tiro';

@Component({
  selector: 'app-tiros-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tiros-modal.component.html',
  styleUrl: './tiros-modal.component.css',
})
export class TirosModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tiroService = inject(TiroService);
  private mensajeService = inject(MensajeService);

  formularioTiro: FormGroup;
  tiros: Tiro[] = [];
  modoCreacionTiro = false;
  tiroSeleccionado: Tiro | null = null;

  constructor() {
    this.formularioTiro = this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.getTiros();
  }

  getTiros() {
    this.tiroService.getTirosPorTurno().subscribe({
      next: (data: Tiro[]) => {
        this.tiros = data;
      },
      error: () => {
        this.mensajeService.error('Error al traer los tiros');
      },
    });
  }

  guardarTiro() {
    if (this.formularioTiro.invalid) {
      this.mensajeService.error('Por favor, especifica una cantidad válida');
      return;
    }
    const cantidad = this.formularioTiro.value.cantidad * 1000;

    if (this.tiroSeleccionado) {
      // Modo edición
      const tiroActualizado: Tiro = {
        ...this.tiroSeleccionado,
        cantidad: cantidad,
      };
      this.tiroService.actualizar(tiroActualizado.id!, tiroActualizado).subscribe({
        next: () => {
          this.mensajeService.success('Tiro actualizado con éxito');
          this.ocultarFormularioTiro();
        },
        error: () => {
          this.mensajeService.error('Error al actualizar el tiro');
        },
      });
    } else {
      // Modo creación
      this.tiroService.crearTiro(cantidad).subscribe({
        next: () => {
          this.mensajeService.success('Tiro registrado con éxito');
          this.ocultarFormularioTiro(); // Vuelve a la vista de tabla
        },
        error: (error) => {
          this.mensajeService.error('Error al registrar el tiro: ' + error.message);
        },
      });
    }
  }

  editarTiro(tiro: Tiro) {
    this.tiroSeleccionado = tiro;
    this.modoCreacionTiro = true;
    this.formularioTiro.patchValue({
      cantidad: tiro.cantidad / 1000,
    });
  }

  anularTiro(tiro: Tiro) {
    this.tiroService.anular(tiro.id!).subscribe({
      next: () => {
        this.mensajeService.success('Tiro anulado con éxito');
        this.getTiros();
      },
      error: () => {
        this.mensajeService.error('Error al anular el tiro');
      },
    });
  }

  mostrarFormularioTiro(): void {
    this.tiroSeleccionado = null;
    this.modoCreacionTiro = true;
    this.formularioTiro.reset({ cantidad: 1 });
  }

  ocultarFormularioTiro(): void {
    this.modoCreacionTiro = false;
    this.tiroSeleccionado = null;
    this.formularioTiro.reset({ cantidad: 1 });
    this.getTiros();
  }
}