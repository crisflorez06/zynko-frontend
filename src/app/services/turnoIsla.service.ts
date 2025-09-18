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

  //aca si sobreescribir como dice chatgpt
  editarNumeracionInicial(request: Numeracion): Observable<Numeracion> {
    return this.http.put<Numeracion>(`${this.apiUrl}/editar-inicial`, request);
  }

  //aca no porque la numeracion que se pasa es la final
  calcularVentasIsla(request: Numeracion): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/calcular-total`, request);
  }

}
