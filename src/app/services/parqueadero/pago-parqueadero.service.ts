import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PagoParqueaderoService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/pagos`;


  calcularTotal(codigo: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/calcular-total/${codigo}`);
  }
}
