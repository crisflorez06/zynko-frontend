import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TurnoIslaService } from '../../services/turnoIsla.service';
import { MensajeService } from '../../services/mensaje.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Numeracion } from '../../models/turnoIsla';
import { NumeracionModalComponent } from '../modales/numeracion-modal/numeracion-modal.component';
import { TirosModalComponent } from '../modales/tiros-modal/tiros-modal.component';
import { TurnoIslaStore } from '../../store/turno-isla.store';
import { CreditosModalComponent } from "../modales/creditos-modal/creditos-modal.component";

@Component({
  selector: 'app-isla',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NumeracionModalComponent,
    TirosModalComponent,
    CreditosModalComponent
],
  templateUrl: './isla.component.html',
  styleUrl: './isla.component.css',
})
export class IslaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(TurnoIslaStore);
  private turnoIslaService = inject(TurnoIslaService);
  private mensajeService = inject(MensajeService);

  formularioNumeracionFinal: FormGroup;
  formularioTurno: FormGroup;

  turno$ = this.store.turno$;

  constructor();

  constructor() {
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

    this.formularioTurno = this.fb.group({
      totalVentas: [0, Validators.required],
      totalTiros: [0, Validators.required],
      totalCreditos: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.turnoIslaService.getTurnoActivo().subscribe((turno) => {
      this.store.setTurno(turno);
    });

    this.turno$.subscribe((turno) => {
      if (turno) {
        this.formularioNumeracionFinal.patchValue({
          gasolina1: turno.gasolinaFinal1,
          gasolina2: turno.gasolinaFinal2,
          gasolina3: turno.gasolinaFinal3,
          gasolina4: turno.gasolinaFinal4,
          diesel1: turno.dieselFinal1,
          diesel2: turno.dieselFinal2,
          diesel3: turno.dieselFinal3,
          diesel4: turno.dieselFinal4,
        });
        this.formularioTurno.patchValue({
          totalVentas: turno.totalVentas,
          totalTiros: turno.totalTiros,
          totalCreditos: turno.totalCreditos,
        });
      }
    });

    this.formularioNumeracionFinal.disable();
  }

  habilitarEdicionFinal(): void {
    this.formularioNumeracionFinal.enable();
  }

  calcularVenta(): void {
    if (this.formularioNumeracionFinal.valid) {

      const numeracionFinal: Numeracion = this.formularioNumeracionFinal.value;

      this.turnoIslaService.calcularVentasIsla(numeracionFinal).subscribe({
        next: (totalVentas: number) => {
          this.mensajeService.success('Numeración final actualizada con éxito');
          if (this.turno$) {
            this.store.actualizarNumeracionFinal(numeracionFinal);
            this.store.actualizarVentas(totalVentas);
          }
          this.formularioNumeracionFinal.disable();
        },
        error: () => {
          this.mensajeService.error('Error al actualizar la numeración final');
        },
      });
    }
  }
}
