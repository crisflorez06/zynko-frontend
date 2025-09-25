import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Numeracion, TurnoIslaResponse } from '../models/turnoIsla';

@Injectable({
  providedIn: 'root',
})
export class TurnoIslaService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/turnos-isla`;

  getTurnoActivo(): Observable<TurnoIslaResponse> {
    return this.http.get<TurnoIslaResponse>(`${this.apiUrl}/turno-activo`);
  }

  editarNumeracionInicial(request: Numeracion): Observable<Numeracion> {
    return this.http.patch<Numeracion>(
      `${this.apiUrl}/editar-inicial`,
      request
    );
  }

  editarVisas(totalVisas: number): Observable<number> {
    const body = { totalVisas: totalVisas };
    return this.http.patch<number>(`${this.apiUrl}/editar-visas`, body);
  }

  calcularVentasIsla(request: Numeracion): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/calcular-total`, request);
  }
}
