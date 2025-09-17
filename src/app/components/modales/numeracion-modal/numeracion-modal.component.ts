import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Numeracion, TurnoIslaResponse } from '../../../models/turnoIsla';
import { CierreIslaService } from '../../../services/turno-isla.service';
import { MensajeService } from '../../../services/mensaje.service';

@Component({
  selector: 'app-numeracion-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './numeracion-modal.component.html',
  styleUrl: './numeracion-modal.component.css',
})
export class NumeracionModalComponent implements OnInit {
  private CierreIslaService = inject(CierreIslaService);
  private fb = inject(FormBuilder);
  private mensajeService = inject(MensajeService);

  formularioNumeracionInicial: FormGroup;
  turnoActivo: TurnoIslaResponse | null = null;

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
  }

  ngOnInit(): void {
    this.CierreIslaService.getTurnoActivo().subscribe({
      next: (data: TurnoIslaResponse) => {
        this.formularioNumeracionInicial.patchValue(data);
        this.formularioNumeracionInicial.disable();
        this.turnoActivo = data;
      },
    });
  }

  habilitarEdicion(): void {
    this.formularioNumeracionInicial.enable();
  }

  guardarNumeracionInicial(): void {
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
}
