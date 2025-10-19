import { VehiculoCierre } from "../vehiculos";
export interface LavadoRequest {
  placa: string;
  tipoVehiculo: string;
  lavadorId: number;
  valorTotal: number;
  pagado: boolean;
}

export interface Lavado extends LavadoRequest {
  id: number;
  lavadorNombre?: string;
  lavador?: string;
  pagado: boolean;
  fechaRegistro: string;
}

export interface ResumenLavador {
  lavador: string;
  totalRecaudado: number;
  paraEstacion: number;
  paraLavador: number;
  vehiculos: VehiculoCierre[];
}

export interface ResumenLavadero {
  totalLavados: number;
  totalRecaudado: number;
  totalEstacion: number;
  totalLavadores: number;
  totalPendiente: number;
  detalleLavadores: ResumenLavador[];
}

export interface ResumenSemanalLavador {
  lavador: string;
  domingo: number;
  lunes: number;
  martes: number;
  miercoles: number;
  jueves: number;
  viernes: number;
  sabado: number;
}
