import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TurnoIslaStore } from '../../../../store/turno-isla.store';

@Component({
  selector: 'app-lavadero-resumen-semanal-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lavadero-resumen-semanal-modal.component.html',
  styleUrl: './lavadero-resumen-semanal-modal.component.css',
})
export class LavaderoResumenSemanalModalComponent {
  private store = inject(TurnoIslaStore);

  resumenSemanal$ = this.store.resumenSemanalLavadero$;
}
