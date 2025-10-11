import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Lavado, LavadoRequest } from '../../../../models/lavado/lavadero';
import { FiltroService } from '../../../../services/filtro.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-lavadero-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lavadero-form-modal.component.html',
  styleUrl: './lavadero-form-modal.component.css',
})
export class LavaderoFormModalComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private filtroService = inject(FiltroService);

  @Input() modoEdicion = false;
  @Input() lavado: Lavado | null = null;
  @Input() trigger = 0;

  @Output() crear = new EventEmitter<LavadoRequest>();
  @Output() actualizar = new EventEmitter<{ id: number; request: LavadoRequest }>();

  tiposVehiculo: string[] = [];
  lavadores: string[] = [];

  formularioLavado = this.fb.group({
    placa: ['', [Validators.required, Validators.maxLength(8)]],
    tipoVehiculo: ['', [Validators.required, Validators.maxLength(30)]],
    lavador: ['', [Validators.required, Validators.maxLength(50)]],
    valorTotal: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.filtroService
      .getFiltros()
      .pipe(take(1))
      .subscribe({
        next: (filtros) => {
          this.tiposVehiculo = filtros.tiposVehiculo ?? [];
          this.lavadores = filtros.lavadores ?? [];
        },
        error: () => {
          this.tiposVehiculo = [];
          this.lavadores = [];
        },
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trigger']) {
      this.sincronizarFormulario();
      return;
    }

    if (changes['lavado'] || changes['modoEdicion']) {
      this.sincronizarFormulario();
    }
  }

  campoInvalido(controlName: keyof LavadoRequest): boolean {
    const control = this.formularioLavado.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  guardar(): void {
    if (this.formularioLavado.invalid) {
      this.formularioLavado.markAllAsTouched();
      return;
    }

    const valores = this.formularioLavado.value;
    const request: LavadoRequest = {
      placa: (valores.placa ?? '').toUpperCase(),
      tipoVehiculo: valores.tipoVehiculo ?? '',
      lavador: valores.lavador ?? '',
      valorTotal: Number(valores.valorTotal ?? 0),
    };

    if (this.modoEdicion && this.lavado) {
      this.actualizar.emit({ id: this.lavado.id, request });
    } else {
      this.crear.emit(request);
    }
  }

  private sincronizarFormulario(): void {
    if (this.modoEdicion && this.lavado) {
      this.formularioLavado.patchValue({
        placa: this.lavado.placa,
        tipoVehiculo: this.lavado.tipoVehiculo,
        lavador: this.lavado.lavador,
        valorTotal: this.lavado.valorTotal,
      });
    } else {
      this.formularioLavado.reset({
        placa: '',
        tipoVehiculo: '',
        lavador: '',
        valorTotal: 0,
      });
    }
  }
}
