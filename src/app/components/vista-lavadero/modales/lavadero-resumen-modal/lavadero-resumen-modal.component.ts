import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TurnoIslaStore } from '../../../../store/turno-isla.store';

@Component({
  selector: 'app-lavadero-resumen-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lavadero-resumen-modal.component.html',
  styleUrl: './lavadero-resumen-modal.component.css',
})
export class LavaderoResumenModalComponent {
  private store = inject(TurnoIslaStore);

  resumenLavadero$ = this.store.resumenLavadero$;
}
