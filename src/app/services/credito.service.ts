import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreditoRequest, CreditoResponse, ListarProductosClientes } from '../models/credito';

@Injectable({ providedIn: 'root' })
export class CreditoService {
  private apiUrl = `${environment.apiUrl}/creditos`;

  private http = inject(HttpClient);

  crearCredito(request: CreditoRequest): Observable<CreditoResponse> {
    return this.http.post<CreditoResponse>(this.apiUrl, request);
  }

  obtenerTodos(): Observable<CreditoResponse[]> {
    return this.http.get<CreditoResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<CreditoResponse> {
    return this.http.get<CreditoResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerDelTurnoActivo(): Observable<CreditoResponse[]> {
    return this.http.get<CreditoResponse[]>(`${this.apiUrl}/turno-activo`);
  }

  actualizar(
    id: number,
    CreditoRequest: CreditoRequest
  ): Observable<CreditoResponse> {
    return this.http.put<CreditoResponse>(
      `${this.apiUrl}/${id}`,
      CreditoRequest
    );
  }

  listarProductosClientes(): Observable<ListarProductosClientes> {
    return this.http.get<ListarProductosClientes>(
      `${this.apiUrl}/listar-productos-clientes`
    );
  }

  eliminarCredito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
