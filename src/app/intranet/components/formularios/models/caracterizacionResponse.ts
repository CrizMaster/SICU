import { ViasCaracterizacion } from "./vias.model";

export interface CaracterizacionResponse {
    id?: number,
    codigoLote: number,
    codigoLoteCaracterizacion: string,
    subLote: string,
    sectorUrbano: string,
    manzanaUrbana: string,
    loteUrbano: string,    
    codigoHabilitacion: string,
    habilitacion: string,
    tipoDivision: string,
    listaVias: ViasCaracterizacion[],
    listaArchivos: ArchivoModel[]
}

export interface ArchivoModel {
    codigoArchivo: number,
    nombreArchivo: string,
    tipoArchivo: number
}

export interface FilterCaracterizacion {
    codigoCaracterizacion: number,
    codigoLoteCaracterizacion: string,
    codigoLote: number,
    codigoDetalle: number
}