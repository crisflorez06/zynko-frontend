import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnoIslaStore } from '../../../store/turno-isla.store';
import { MensajeService } from '../../../services/mensaje.service';
import { LavaderoResumenModalComponent } from '../modales/lavadero-resumen-modal/lavadero-resumen-modal.component';
import { LavaderoFormModalComponent } from '../modales/lavadero-form-modal/lavadero-form-modal.component';
import { Lavado, LavadoRequest } from '../../../models/lavado/lavadero';

@Component({
  selector: 'app-lavadero',
  standalone: true,
  imports: [
    CommonModule,
    LavaderoResumenModalComponent,
    LavaderoFormModalComponent,
  ],
  templateUrl: './lavadero.component.html',
  styleUrl: './lavadero.component.css',
})
export class LavaderoComponent implements OnInit {
  private store = inject(TurnoIslaStore);
  private mensajeService = inject(MensajeService);

  lavados$ = this.store.lavados$;
  lavadoSeleccionado: Lavado | null = null;
  modoEdicion = false;
  modalTrigger = 0;

  ngOnInit(): void {
    this.store.cargarLavaderosDelDia().subscribe({
      error: () => {
        this.mensajeService.error(
          'No fue posible cargar los servicios de lavadero.'
        );
      },
    });
  }

  abrirCrear(): void {
    this.modoEdicion = false;
    this.lavadoSeleccionado = null;
    this.modalTrigger++;
  }

  abrirEditar(lavado: Lavado): void {
    this.modoEdicion = true;
    this.lavadoSeleccionado = lavado;
    this.modalTrigger++;
  }

  registrarLavado(request: LavadoRequest): void {
    this.store.registrarLavado(request).subscribe({
      next: () => {
        this.mensajeService.success('Lavado registrado con éxito.');
        this.cerrarModal();
      },
      error: () => {
        this.mensajeService.error('No fue posible registrar el lavado.');
      },
    });
  }

  actualizarLavado(evento: { id: number; request: LavadoRequest }): void {
    this.store.actualizarLavado(evento.id, evento.request).subscribe({
      next: () => {
        this.mensajeService.success('Lavado actualizado con éxito.');
        this.cerrarModal();
      },
      error: () => {
        this.mensajeService.error('No fue posible actualizar el lavado.');
      },
    });
  }

  cambiarEstado(lavado: Lavado): void {
    const pagado = !lavado.pagado;
    this.store.cambiarEstadoLavado(lavado.id, pagado).subscribe({
      next: () => {
        this.mensajeService.success(
          pagado ? 'Lavado marcado como pagado.' : 'Lavado marcado como pendiente.'
        );
      },
      error: () => {
        this.mensajeService.error('No fue posible cambiar el estado del lavado.');
      },
    });
  }

  private cerrarModal(): void {
    const modalElement = document.getElementById('lavaderoFormModal');
    if (!modalElement) {
      return;
    }
    const bootstrapRef =
      typeof window !== 'undefined' ? (window as any).bootstrap : undefined;
    const modalInstance =
      bootstrapRef?.Modal?.getInstance(modalElement) ??
      (bootstrapRef?.Modal ? new bootstrapRef.Modal(modalElement) : null);
    modalInstance?.hide();
    this.modoEdicion = false;
    this.lavadoSeleccionado = null;
  }
}
