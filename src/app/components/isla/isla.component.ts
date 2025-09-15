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
import { UsuarioService } from '../../services/usuario.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketResponse } from '../../models/tickets';
import { Numeracion } from '../../models/cierreIsla';

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
  usuario: Usuario | null = null;
  ticketEncontrado: TicketResponse | null = null;

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
  }

  ngOnInit(): void {
    this.CierreIslaService.getNumeracionTurnoActivo().subscribe({
      next: (data: Numeracion) => {
        this.formularioNumeracionInicial.patchValue(data);
        this.formularioNumeracionInicial.disable(); // bloquea edición inicial
      },
    });
  }

  habilitarEdicion(): void {
    this.formularioNumeracionInicial.enable();
  }

  guardar(): void {
    if (this.formularioNumeracionInicial.valid) {
      const valores: Numeracion = this.formularioNumeracionInicial.value;
      console.log('Enviar al backend:', valores);
      // aquí harías el POST/PUT al backend
    }
  }
}

