export interface Gasto {
  id?: number;
  nombre: string;
  cantidad: number;
  fecha: string;
}

export interface GastoResquest {
  nombre: string;
  cantidad: number;
}
