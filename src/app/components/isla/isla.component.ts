import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CierreIslaService } from '../../services/cierre-isla.service';
import { Usuario } from '../../models/usuario';
import { MensajeService } from '../../services/mensaje.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketResponse } from '../../models/tickets';
import { Numeracion, TurnoIslaResponse } from '../../models/turnoIsla';

@Component({
  selector: 'app-isla',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './isla.component.html',
  styleUrl: './isla.component.css',
})
export class IslaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private CierreIslaService = inject(CierreIslaService);
  private mensajeService = inject(MensajeService);

  formularioNumeracionInicial: FormGroup;
  formularioNumeracionFinal: FormGroup;
  usuario: Usuario | null = null;
  ticketEncontrado: TicketResponse | null = null;
  turnoActivo: TurnoIslaResponse | null = null;

  constructor();

  constructor() {
    this.formularioNumeracionInicial = this.fb.group({
      gasolina1: [0, Validators.required],
      gasolina2: [0, Validators.required],
      gasolina3: [0, Validators.required],
      gasolina4: [0, Validators.required],
      diesel1: [0, Validators.required],
      diesel2: [0, Validators.required],
      diesel3: [0, Validators.required],
      diesel4: [0, Validators.required],
    });

    this.formularioNumeracionFinal = this.fb.group({
      gasolina1: [0, Validators.required],
      gasolina2: [0, Validators.required],
      gasolina3: [0, Validators.required],
      gasolina4: [0, Validators.required],
      diesel1: [0, Validators.required],
      diesel2: [0, Validators.required],
      diesel3: [0, Validators.required],
      diesel4: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.CierreIslaService.getTurnoActivo().subscribe({
      next: (data: TurnoIslaResponse) => {
        this.formularioNumeracionInicial.patchValue(data);
        this.formularioNumeracionInicial.disable();
        this.turnoActivo = data;
        this.formularioNumeracionFinal.patchValue(data);
        this.formularioNumeracionFinal.disable();
      },
    });
  }

  habilitarEdicion(): void {
    this.formularioNumeracionInicial.enable();
  }

  habilitarEdicionFinal(): void {
    this.formularioNumeracionFinal.enable();
  }

  guardar(): void {
    if (this.formularioNumeracionInicial.valid) {
      const valores: Numeracion = this.formularioNumeracionInicial.value;
      this.CierreIslaService.editarNumeracionInicial(valores).subscribe({
        next: (data: Numeracion) => {
          this.mensajeService.success(
            'Numeración inicial actualizada con éxito'
          );
          this.formularioNumeracionInicial.patchValue(data);
          this.formularioNumeracionInicial.disable();
        },
        error: () => {
          this.mensajeService.error(
            'Error al actualizar la numeración inicial'
          );
        },
      });
    }
  }

  calcularVenta(): void {
    if (this.formularioNumeracionFinal.valid) {
      const valores: Numeracion = this.formularioNumeracionFinal.value;
      this.CierreIslaService.calcularVentasIsla(valores).subscribe({
        next: (totalVentas: number) => {
          this.mensajeService.success('Venta calculada con éxito');
          if (this.turnoActivo) {
            this.turnoActivo.totalVentas = totalVentas;
          }
          this.formularioNumeracionFinal.disable();
        },
        error: () => {
          this.mensajeService.error('Error al calcular la venta');
        },
      });
    }
  }
}

