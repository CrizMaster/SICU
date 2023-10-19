import { ViasCaracterizacionRequest } from "./vias.model";

export interface InformacionLoteRequest {
    usuarioCreacion: string,
    terminalCreacion: string,
    codigoRegistroCaracterizacion: number,
    codigoLoteCaracterizacion: string,
    codigoDetalle: number,
    listaVias?: ViasCaracterizacionRequest[]
}