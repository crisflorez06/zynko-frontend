export interface TicketEntradaParqueaderoRequest {
  placa: string;
  tipoVehiculo: string;
  usuarioRecibioId: number;
  parqueadero: string;
}

export interface TicketMensualidadParqueaderoRequest {
  fechaHoraEntrada: string;
  usuarioId: number;
  placa: string;
  tipoVehiculo: string;
  parqueadero: string;
  dias: number;
  total: number;
}

export interface TicketParqueaderoResponse {
  codigo: string;
  placa: string;
  tipoVehiculo: string;
  fechaHoraEntrada: string;
  fechaHoraSalida: string;
  estadoPago: boolean;
  totalPagar: number;
  usuarioRecibio: string;
  usuarioEntrego: string;
  parqueadero: string;
}

export interface TicketSalidaParqueaderoRequest {
  codigo: string;
  idUsuarioLogueado: number;
}
