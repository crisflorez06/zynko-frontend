import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TurnoIslaService } from '../../../services/turnoIsla.service'; // Asegúrate que la ruta sea correcta
import { MensajeService } from '../../../services/mensaje.service'; // Asegúrate que la ruta sea correcta
import { TurnoIslaStore } from '../../../store/turno-isla.store'; // Asegúrate que la ruta sea correcta

@Component({
  selector: 'app-visas-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './visas-modal.component.html',
  styleUrl: './visas-modal.component.css',
  standalone: true,
})
export class VisasModalComponent implements OnInit {
  private turnoIslaService = inject(TurnoIslaService);
  private mensajeService = inject(MensajeService);
  private store = inject(TurnoIslaStore);

  isEdit = false;
  valorVisa: number | null = null;

  ngOnInit(): void {
    this.turnoIslaService.getTurnoActivo().subscribe((turno) => {
      if (turno) {
        this.valorVisa = turno.totalVisas ?? 0;
      }
    });
  }

  iniciarEdicion(): void {
    this.isEdit = true;
  }

  guardarCambios(): void {
    if (this.valorVisa === null) {
      this.mensajeService.error('El valor de la visa es inválido.');
      return;
    }

    this.turnoIslaService.editarVisas(this.valorVisa).subscribe({
      next: () => {
        this.mensajeService.success('El valor de la visa se ha actualizado correctamente.');
        this.isEdit = false;
        this.store.actualizarVisas(this.valorVisa!);
      },
      error: () => {
        this.mensajeService.error('No se pudo actualizar el valor de la visa.');
      }
    });
  }
}
