import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  formularioLogin: FormGroup;
  error: string | null = null;

  constructor() {
    this.formularioLogin = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.formularioLogin.valid) {
      const credenciales: Usuario = this.formularioLogin.value;

      this.usuarioService
        .login(credenciales.nombre, credenciales.cedula)
        .subscribe({
          next: (isLoggedIn) => {
            if (isLoggedIn) {
              this.router.navigate(['/tabla']);
            }
          },
          error: (err) => {
            console.error('Error de inicio de sesión:', err);
            this.error = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
          }
        });
    }
  }
}
