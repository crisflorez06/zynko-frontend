import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Gasto, GastoResquest } from '../../models/isla/gasto';

@Injectable({ providedIn: 'root' })
export class GastoIslaService {
  private apiUrl = `${environment.apiUrl}/gastos`;

  private http = inject(HttpClient);

  getGastosPorTurno(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.apiUrl}/turno-activo`);
  }

  crearGasto(gasto: GastoResquest): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl,  gasto );
  }

  actualizar(id: number, gasto: Gasto): Observable<Gasto> {
    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, gasto);
  }

  anular(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
