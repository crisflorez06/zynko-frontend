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
import { LavadorFiltro, LavadorFiltroDTO } from '../../../../models/filtros';

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
  lavadores: LavadorFiltro[] = [];

  formularioLavado = this.fb.group({
    placa: ['', [Validators.required, Validators.maxLength(8)]],
    tipoVehiculo: ['', [Validators.required, Validators.maxLength(30)]],
    lavadorId: [null as number | null, [Validators.required, Validators.min(1)]],
    valorTotal: [null as number | null, [Validators.required, Validators.min(1)]],
    pagado: [false],
  });

  ngOnInit(): void {
    this.filtroService
      .getFiltros()
      .pipe(take(1))
      .subscribe({
        next: (filtros) => {
          this.tiposVehiculo = filtros.tiposVehiculo ?? [];
          this.lavadores = this.mapLavadores(filtros.lavadores ?? []);
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
      lavadorId: Number(valores.lavadorId ?? 0),
      valorTotal: Number(valores.valorTotal ?? 0),
      pagado: Boolean(valores.pagado ?? false),
    };

    if (request.valorTotal <= 0) {
      const control = this.formularioLavado.get('valorTotal');
      control?.setErrors({ min: true });
      control?.markAsTouched();
      return;
    }

    if (request.lavadorId <= 0 || Number.isNaN(request.lavadorId)) {
      const control = this.formularioLavado.get('lavadorId');
      control?.setErrors({ min: true });
      control?.markAsTouched();
      return;
    }

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
        lavadorId: this.lavado.lavadorId ?? null,
        valorTotal: this.lavado.valorTotal,
        pagado: this.lavado.pagado,
      });
    } else {
      this.formularioLavado.reset({
        placa: '',
        tipoVehiculo: '',
        lavadorId: null,
        valorTotal: null,
        pagado: false,
      });
    }
  }

  private mapLavadores(lavadores: LavadorFiltroDTO[]): LavadorFiltro[] {
    return lavadores.map((lavador, index) => {
      if (typeof lavador === 'string') {
        return { id: index + 1, nombre: lavador };
      }
      return lavador;
    });
  }
}
