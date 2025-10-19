import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TarifaParqueadero } from '../../models/parqueadero/tarifaParqueadero';

@Injectable({
  providedIn: 'root',
})
export class TarifaParqueaderoService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/tarifas`;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  // ===============================
  // 1. Obtener todos los vehículos
  // ===============================
  getTarifas(): Observable<TarifaParqueadero[]> {
    return this.http.get<TarifaParqueadero[]>(this.apiUrl);
  }
}
