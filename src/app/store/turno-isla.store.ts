import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TurnoIslaResponse, Numeracion } from '../models/isla/turnoIsla';
import { TurnoIslaService } from '../services/isla/turno-isla.service';
import {
  Lavado,
  LavadoRequest,
  ResumenLavadero,
  ResumenSemanalLavador,
} from '../models/lavado/lavadero';
import { LavaderoService } from '../services/lavado/lavadero.service';

@Injectable({
  providedIn: 'root',
})
export class TurnoIslaStore {
  // Estado reactivo del turno
  private turnoSubject = new BehaviorSubject<TurnoIslaResponse | null>(null);
  private turnoIslaService = inject(TurnoIslaService);
  private lavaderoService = inject(LavaderoService);
  private lavadosSubject = new BehaviorSubject<Lavado[]>([]);
  private resumenLavaderoSubject = new BehaviorSubject<ResumenLavadero | null>(null);
  private resumenSemanalSubject =
    new BehaviorSubject<ResumenSemanalLavador[] | null>(null);
  lavados$ = this.lavadosSubject.asObservable();
  resumenLavadero$ = this.resumenLavaderoSubject.asObservable();
  resumenSemanalLavadero$ = this.resumenSemanalSubject.asObservable();
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
    this.actualizarCuadre();

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
    this.actualizarCuadre();
  }

  actualizarVentas(totalVentas: number) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        totalVentas,
      });
    }
    this.actualizarCuadre();
  }

  actualizarTiros(totalTiros: number) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        totalTiros,
      });
    }
    this.actualizarCuadre();
  }


  actualizarCreditos(totalCreditos: number) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        totalCreditos,
      });
    }
    this.actualizarCuadre();
  }

  actualizarVisas(totalVisas: number) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        totalVisas,
      });
    }
    this.actualizarCuadre();
  }

  actualizarGastos(totalGastos: number) {
    const actual = this.turnoSubject.value;
    if (actual) {
      this.turnoSubject.next({
        ...actual,
        totalGastos,
      });
    }
    this.actualizarCuadre();
  }

  actualizarCuadre() {
    this.turnoIslaService.calcularCuadre().subscribe({
      next: (cuadre) => {
        const actual = this.turnoSubject.value;
        if (actual) {
          this.turnoSubject.next({
            ...actual,
            cuadre,
          });
        }
      },
      error: (err) => {
        console.error('Error al calcular el cuadre', err);
      },
    });
  }

  cargarLavaderosDelDia(): Observable<void> {
    return forkJoin({
      lavados: this.lavaderoService.obtenerLavadosDelDia(),
      resumen: this.lavaderoService.obtenerResumenTurno(),
    }).pipe(
      tap(({ lavados, resumen }) => {
        this.lavadosSubject.next(lavados);
        if (resumen) {
          this.resumenLavaderoSubject.next({
            ...resumen,
            detalleLavadores: resumen.detalleLavadores ?? [],
          });
        } else {
          this.resumenLavaderoSubject.next(null);
        }
      }),
      map(() => undefined)
    );
  }

  registrarLavado(request: LavadoRequest): Observable<Lavado> {
    return this.lavaderoService.registrarLavado(request).pipe(
      switchMap((lavado) =>
        this.cargarLavaderosDelDia().pipe(map(() => lavado))
      )
    );
  }

  actualizarLavado(id: number, request: LavadoRequest): Observable<Lavado> {
    return this.lavaderoService.actualizarLavado(id, request).pipe(
      switchMap((lavado) =>
        this.cargarLavaderosDelDia().pipe(map(() => lavado))
      )
    );
  }

  cambiarEstadoLavado(id: number, pagado: boolean): Observable<Lavado> {
    return this.lavaderoService.cambiarEstado(id, pagado).pipe(
      switchMap((lavado) =>
        this.cargarLavaderosDelDia().pipe(map(() => lavado))
      )
    );
  }

  eliminarLavado(id: number): Observable<void> {
    return this.lavaderoService.eliminarLavado(id).pipe(
      switchMap(() => this.cargarLavaderosDelDia())
    );
  }

  ajustarFechasLavadero(): Observable<void> {
    return this.lavaderoService.ajustarFechas().pipe(
      switchMap(() => this.cargarLavaderosDelDia())
    );
  }

  cargarResumenSemanalLavadero(): Observable<ResumenSemanalLavador[]> {
    this.resumenSemanalSubject.next(null);
    return this.lavaderoService.obtenerResumenSemanal().pipe(
      tap((datos) => this.resumenSemanalSubject.next(datos))
    );
  }

  /**
   * Limpia el estado (ejemplo: al cerrar sesión o cerrar turno)
   */
  clear() {
    this.turnoSubject.next(null);
    this.lavadosSubject.next([]);
    this.resumenLavaderoSubject.next(null);
    this.resumenSemanalSubject.next(null);
  }

  /**
   * Obtiene el valor actual del turno de forma síncrona.
   */
  getTurnoActual(): TurnoIslaResponse | null {
    return this.turnoSubject.value;
  }
}
