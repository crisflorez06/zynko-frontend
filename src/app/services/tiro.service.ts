// src/app/services/tiro.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tiro } from '../models/tiro';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TiroService {
  private apiUrl = `${environment.apiUrl}/tiros`;

  private http = inject(HttpClient);

  getTirosPorTurno(): Observable<Tiro[]> {
    return this.http.get<Tiro[]>(`${this.apiUrl}/turno-activo`);
  }

  crearTiro(cantidad: number): Observable<Tiro> {
    return this.http.post<Tiro>(this.apiUrl,  cantidad );
  }

  actualizar(id: number, tiro: Tiro): Observable<Tiro> {
    return this.http.put<Tiro>(`${this.apiUrl}/${id}`, tiro);
  }

  anular(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
