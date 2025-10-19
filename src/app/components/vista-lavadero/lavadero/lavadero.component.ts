import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnoIslaStore } from '../../../store/turno-isla.store';
import { MensajeService } from '../../../services/mensaje.service';
import { LavaderoResumenModalComponent } from '../modales/lavadero-resumen-modal/lavadero-resumen-modal.component';
import { LavaderoFormModalComponent } from '../modales/lavadero-form-modal/lavadero-form-modal.component';
import { LavaderoResumenSemanalModalComponent } from '../modales/lavadero-resumen-semanal-modal/lavadero-resumen-semanal-modal.component';
import { Lavado, LavadoRequest } from '../../../models/lavado/lavadero';

type AccionLavadero = 'eliminar' | 'ajustar' | null;

@Component({
  selector: 'app-lavadero',
  standalone: true,
  imports: [
    CommonModule,
    LavaderoResumenModalComponent,
    LavaderoResumenSemanalModalComponent,
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
  accionPendiente: AccionLavadero = null;
  lavadoPendiente: Lavado | null = null;

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
          pagado
            ? 'Lavado marcado como pagado.'
            : 'Lavado marcado como pendiente.'
        );
      },
      error: () => {
        this.mensajeService.error('No fue posible cambiar el estado del lavado.');
      },
    });
  }

  abrirConfirmacionEliminar(lavado: Lavado): void {
    this.accionPendiente = 'eliminar';
    this.lavadoPendiente = lavado;
    this.mostrarModalConfirmacion();
  }

  abrirConfirmacionAjustar(): void {
    this.accionPendiente = 'ajustar';
    this.lavadoPendiente = null;
    this.mostrarModalConfirmacion();
  }

  abrirResumenSemanal(): void {
    this.store.cargarResumenSemanalLavadero().subscribe({
      error: () => {
        this.mensajeService.error('No fue posible cargar el resumen semanal.');
      },
    });
  }

  confirmarAccion(): void {
    if (this.accionPendiente === 'eliminar' && this.lavadoPendiente) {
      this.ejecutarEliminacion(this.lavadoPendiente);
    } else if (this.accionPendiente === 'ajustar') {
      this.ejecutarAjusteFechas();
    }

    this.cancelarAccion();
  }

  cancelarAccion(): void {
    this.accionPendiente = null;
    this.lavadoPendiente = null;
    this.cerrarModalConfirmacion();
  }

  private ejecutarEliminacion(lavado: Lavado): void {
    const id = Number(lavado.id);
    const totalOriginal = lavado.valorTotal;
    lavado.valorTotal = 0;

    this.store.eliminarLavado(id).subscribe({
      next: () => {
        this.mensajeService.success('Lavado eliminado con éxito.');
      },
      error: () => {
        lavado.valorTotal = totalOriginal;
        this.mensajeService.error('No fue posible eliminar el lavado.');
      },
    });
  }

  private ejecutarAjusteFechas(): void {
    this.store.ajustarFechasLavadero().subscribe({
      next: () => {
        this.mensajeService.success('Vehículos pendientes movidos al día siguiente.');
      },
      error: () => {
        this.mensajeService.error('No fue posible ajustar las fechas.');
      },
    });
  }

  private cerrarModal(): void {
    const modalInstance = this.obtenerInstanciaModal('lavaderoFormModal');
    modalInstance?.hide();
    this.modoEdicion = false;
    this.lavadoSeleccionado = null;
  }

  private mostrarModalConfirmacion(): void {
    const modalInstance = this.obtenerInstanciaModal('confirmacionAccionModal');
    modalInstance?.show();
  }

  private cerrarModalConfirmacion(): void {
    const modalInstance = this.obtenerInstanciaModal('confirmacionAccionModal');
    modalInstance?.hide();
  }

  private obtenerInstanciaModal(elementId: string, createIfMissing = true): any {
    const modalElement = document.getElementById(elementId);
    if (!modalElement) {
      return null;
    }

    const bootstrapRef =
      typeof window !== 'undefined' ? (window as any).bootstrap : undefined;
    if (!bootstrapRef?.Modal) {
      return null;
    }

    const existing = bootstrapRef.Modal.getInstance(modalElement);
    if (existing || !createIfMissing) {
      return existing;
    }

    return new bootstrapRef.Modal(modalElement);
  }
}
