import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);


  canActivate(): boolean {
    if (this.usuarioService.estaLogueado()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
