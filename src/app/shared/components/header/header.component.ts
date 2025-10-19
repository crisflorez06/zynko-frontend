import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { TicketParqueaderoService } from '../../../services/parqueadero/ticket-parqueadero.service';
import { MensajeService } from '../../../services/mensaje.service';
import { QzService } from '../../../services/qz.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CierreParqueaderoService } from '../../../services/parqueadero/cierre-parqueadero.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TurnoIslaStore } from '../../../store/turno-isla.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [DatePipe],
})
export class HeaderComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private store = inject(TurnoIslaStore);
  private router = inject(Router);
  private ticketService = inject(TicketParqueaderoService);
  private mensajeService = inject(MensajeService);
  private qzService = inject(QzService);
  private cierreTurnoService = inject(CierreParqueaderoService);
  private dialog = inject(MatDialog);

  usuario: Usuario | null = null;


  ngOnInit(): void {
    this.usuarioService.usuarioActual$.subscribe((user) => {
      this.usuario = user;
    });
  }

  async logout(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Estás seguro de que quieres cerrar el turno?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cierreTurnoService.crearCierre().subscribe({
          next: async (cierreTurnoDto) => {
            this.mensajeService.success('Cierre de turno guardado correctamente.');

            const texto = this.ticketService.generarTicketHistorial(cierreTurnoDto);

            try {
              await this.qzService.imprimirTexto('ticket', texto);
            } catch (err) {
              this.mensajeService.error('No se pudo imprimir el ticket de cierre.');
              console.error(err);
            }

            this.usuarioService.logout();
            this.store.clear();
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error al crear el cierre de turno', err);
            this.mensajeService.error(
              'Ocurrió un error al generar el cierre de turno.'
            );
            this.usuarioService.logout();
            this.router.navigate(['/login']);
          },
        });
      }
    });
  }

}
