export interface Numeracion {
  gasolina1: number;
  gasolina2: number;
  gasolina3: number;
  gasolina4: number;
  diesel1: number;
  diesel2: number;
  diesel3: number;
  diesel4: number;
}

export interface TurnoIslaResponse {
  gasolinaInicial1: number;
  gasolinaInicial2: number;
  gasolinaInicial3: number;
  gasolinaInicial4: number;
  dieselInicial1: number;
  dieselInicial2: number;
  dieselInicial3: number;
  dieselInicial4: number;

  gasolinaFinal1: number;
  gasolinaFinal2: number;
  gasolinaFinal3: number;
  gasolinaFinal4: number;
  dieselFinal1: number;
  dieselFinal2: number;
  dieselFinal3: number;
  dieselFinal4: number;

  totalVentas: number;
  totalTiros: number;
  totalCreditos: number;
}

