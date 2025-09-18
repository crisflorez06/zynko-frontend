import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Numeracion } from '../../../models/turnoIsla';
import { TurnoIslaService } from '../../../services/turnoIsla.service';
import { MensajeService } from '../../../services/mensaje.service';
import { TurnoIslaStore } from '../../../store/turno-isla.store';

@Component({
  selector: 'app-numeracion-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './numeracion-modal.component.html',
  styleUrl: './numeracion-modal.component.css',
})
export class NumeracionModalComponent implements OnInit {
  private turnoIslaService = inject(TurnoIslaService);
  private fb = inject(FormBuilder);
  private mensajeService = inject(MensajeService);

  private store = inject(TurnoIslaStore);

  turno$ = this.store.turno$;

  formularioNumeracionInicial: FormGroup;

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
    this.turnoIslaService.getTurnoActivo().subscribe((turno) => {
      this.store.setTurno(turno);
    });

    this.turno$.subscribe((turno) => {
      if (turno) {
        this.formularioNumeracionInicial.patchValue({
          gasolina1: turno.gasolinaInicial1,
          gasolina2: turno.gasolinaInicial2,
          gasolina3: turno.gasolinaInicial3,
          gasolina4: turno.gasolinaInicial4,
          diesel1: turno.dieselInicial1,
          diesel2: turno.dieselInicial2,
          diesel3: turno.dieselInicial3,
          diesel4: turno.dieselInicial4,
        });
      }
    });
  }

  habilitarEdicion(): void {
    this.formularioNumeracionInicial.enable();
  }

  guardarNumeracionInicial(): void {
    if (this.formularioNumeracionInicial.valid) {
      const numeracionInicial: Numeracion =
        this.formularioNumeracionInicial.value;

      this.turnoIslaService
        .editarNumeracionInicial(numeracionInicial)
        .subscribe({
          next: (data: Numeracion) => {
            this.mensajeService.success(
              'Numeración inicial actualizada con éxito'
            );
            this.store.actualizarNumeracionInicial(data);

            // Obtener el estado más reciente del turno desde el store
            const turnoActual = this.store.getTurnoActual();

            if (turnoActual) {
              // Construir el objeto de numeración final
              const numeracionFinal: Numeracion = {
                gasolina1: turnoActual.gasolinaFinal1,
                gasolina2: turnoActual.gasolinaFinal2,
                gasolina3: turnoActual.gasolinaFinal3,
                gasolina4: turnoActual.gasolinaFinal4,
                diesel1: turnoActual.dieselFinal1,
                diesel2: turnoActual.dieselFinal2,
                diesel3: turnoActual.dieselFinal3,
                diesel4: turnoActual.dieselFinal4,
              };

              // Recalcular la venta
              this.turnoIslaService
                .calcularVentasIsla(numeracionFinal)
                .subscribe({
                  next: (totalVentas) => {
                    this.store.actualizarVentas(totalVentas);
                  },
                  error: () => {
                    this.mensajeService.error('Error al recalcular la venta');
                  },
                });
            }

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
