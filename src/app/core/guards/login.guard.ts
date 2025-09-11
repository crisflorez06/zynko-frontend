import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);


  canActivate(): boolean {
    if (this.usuarioService.isLoggedIn()) {
      // Si ya está logueado, redirige a "tabla"
      this.router.navigate(['/tabla']);
      return false;
    }
    return true; // Si no está logueado, permite ir a /login
  }
}
