import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tarifa } from '../models/tarifa';

@Injectable({
  providedIn: 'root',
})
export class TarifaService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/tarifas`;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  // ===============================
  // 1. Obtener todos los vehículos
  // ===============================
  getTarifas(): Observable<Tarifa[]> {
    return this.http.get<Tarifa[]>(this.apiUrl);
  }
}
