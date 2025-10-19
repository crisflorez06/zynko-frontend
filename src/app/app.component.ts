import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { Usuario } from './models/usuario';
import { UsuarioService } from './services/usuario.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LoaderComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private usuarioService = inject(UsuarioService);

  usuarioActual$: Usuario | null;

  constructor() {
    this.usuarioActual$ = this.usuarioService.getUsuarioActual();
  }
}
