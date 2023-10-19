import { ViasCaracterizacion } from "./vias.model";

export interface CaracterizacionResponse {
    id?: number,
    codigoLote: string,
    subLote: string,
    sectorUrbano: string,
    manzanaUrbana: string,
    loteUrbano: string,    
    codigoHabilitacion: string,
    habilitacion: string,
    tipoDivision: string,
    listaVias: ViasCaracterizacion[]
}

// export interface ViasCaracterizacion {
//     numeroOrden: number,
//     codigoPuerta: number,
//     codigoRegistroCaracterizacion: number,
//     codigoLote: string,
//     codigoTipoVia: string,
//     nombreVia: string,
//     codigoTipoPuerta: string,
//     numeroMunicipal: string,
//     codigoCondicion: string,
//     codigoEstado: string,
//     checkedAct: boolean,
//     idTipoPuerta?: number,
// }

export interface FilterCaracterizacion {
    codigoCaracterizacion: number,
    codigoLoteCaracterizacion: string,
    codigoLote: number,
    codigoDetalle: number
}