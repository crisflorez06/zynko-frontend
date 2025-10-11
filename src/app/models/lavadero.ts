import { VehiculoCierre } from "./vehiculos";
export interface LavadoRequest {
  placa: string;
  tipoVehiculo: string;
  lavador: string;
  valorTotal: number;
}

export interface Lavado extends LavadoRequest {
  id: number;
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
