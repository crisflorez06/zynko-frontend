import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Lavado,
  LavadoRequest,
  ResumenLavadero,
  ResumenSemanalLavador,
} from '../../models/lavado/lavadero';

@Injectable({
  providedIn: 'root',
})
export class LavaderoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/lavados`;

  obtenerLavadosDelDia(): Observable<Lavado[]> {
    return this.http.get<Lavado[]>(`${this.apiUrl}/turno-activo`);
  }

  registrarLavado(request: LavadoRequest): Observable<Lavado> {
    return this.http.post<Lavado>(`${this.apiUrl}`, request);
  }

  actualizarLavado(id: number, request: LavadoRequest): Observable<Lavado> {
    return this.http.put<Lavado>(`${this.apiUrl}/${id}`, request);
  }

  eliminarLavado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  ajustarFechas(): Observable<string> {
    return this.http.put(`${this.apiUrl}/ajustar-fechas`, {}, { responseType: 'text' });
  }

  cambiarEstado(id: number, pagado: boolean): Observable<Lavado> {
    return this.http.patch<Lavado>(
      `${this.apiUrl}/${id}/estado`,
      {},
      { params: { pagado } }
    );
  }

  obtenerResumenTurno(): Observable<ResumenLavadero> {
    return this.http.get<ResumenLavadero>(`${this.apiUrl}/turno-activo/resumen`);
  }

  obtenerResumenSemanal(): Observable<ResumenSemanalLavador[]> {
    return this.http.get<ResumenSemanalLavador[]>(`${this.apiUrl}/resumen-semanal`);
  }
}
