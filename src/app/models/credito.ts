import { cliente } from './cliente';
import { Producto } from './producto';

export interface CreditoProductoRequest {
  productoId: number;
  precioVenta: number;
}

export interface CreditoProductoResponse {
  id: number;
  producto: Producto;
  precioVenta: number;
}

export interface CreditoRequest {
  clienteId: number;
  items: CreditoProductoRequest[];
  placa?: string;
}

export interface CreditoResponse {
  id: number;
  cliente: string;
  total: number;
  fecha: string;
  items: CreditoProductoResponse[];
  placa: string;
  idCliente:number
}

export interface ListarProductosClientes {
  productos: Producto[];
  clientes: cliente[];
}
