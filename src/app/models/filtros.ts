export interface LavadorFiltro {
  id: number;
  nombre: string;
}

export type LavadorFiltroDTO = LavadorFiltro | string;

export interface FiltrosDTO {
  usuarios: string[];
  tiposVehiculo: string[];
  parqueaderos: string[];
  lavadores: LavadorFiltroDTO[];
}
