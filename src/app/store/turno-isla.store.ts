import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TurnoIslaResponse, Numeracion } from '../models/turnoIsla';

@Injectable({
  providedIn: 'root',
})
export class TurnoIslaStore {
  // Estado reactivo del turno
  private turnoSubject = new BehaviorSubject<TurnoIslaResponse | null>(null);

  // Observable que exponen los datos (lo que usarán los componentes)
  turno$ = this.turnoSubject.asObservable();

  /**
   * Guarda el turno completo (ejemplo: al cargar desde backend)
   */
  setTurno(turno: TurnoIslaResponse) {
    this.turnoSubject.next(turno);
  }

  /**
   * Actualiza solo las numeraciones (gasolinas y diésel)
   */
  actualizarNumeracionInicial(numeracion: Numeracion) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        gasolinaInicial1: numeracion.gasolina1,
        gasolinaInicial2: numeracion.gasolina2,
        gasolinaInicial3: numeracion.gasolina3,
        gasolinaInicial4: numeracion.gasolina4,
        dieselInicial1: numeracion.diesel1,
        dieselInicial2: numeracion.diesel2,
        dieselInicial3: numeracion.diesel3,
        dieselInicial4: numeracion.diesel4,
      });
    }
  }

  actualizarNumeracionFinal(numeracion: Numeracion) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        gasolinaFinal1: numeracion.gasolina1,
        gasolinaFinal2: numeracion.gasolina2,
        gasolinaFinal3: numeracion.gasolina3,
        gasolinaFinal4: numeracion.gasolina4,
        dieselFinal1: numeracion.diesel1,
        dieselFinal2: numeracion.diesel2,
        dieselFinal3: numeracion.diesel3,
        dieselFinal4: numeracion.diesel4,
      });
    }
  }

  actualizarVentas(totalVentas: number) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        totalVentas,
      });
    }
  }

  actualizarTiros(totalTiros: number) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        totalTiros,
      });
    }
  }

  actualizarCreditos(totalCreditos: number) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        totalCreditos,
      });
    }
  }

  actualizarVisas(totalVisas: number) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        totalVisas,
      });
    }
  }

  /**
   * Limpia el estado (ejemplo: al cerrar sesión o cerrar turno)
   */
  clear() {
    this.turnoSubject.next(null);
  }

  /**
   * Obtiene el valor actual del turno de forma síncrona.
   */
  getTurnoActual(): TurnoIslaResponse | null {
    return this.turnoSubject.value;
  }
}
