import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Numeracion } from '../models/cierreIsla';

@Injectable({
  providedIn: 'root',
})
export class CierreIslaService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/turnos-isla`;

  getNumeracionTurnoActivo(): Observable<Numeracion> {
    return this.http.get<Numeracion>(`${this.apiUrl}/numeracion-inicial`);
  }
}
