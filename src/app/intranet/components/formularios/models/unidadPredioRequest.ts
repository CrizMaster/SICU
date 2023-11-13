import { ArchivoModel } from "./caracterizacionResponse";

export interface UnidadPredioRequest {
    usuarioCreacion: string,
    terminalCreacion: string,
    codigoUnidadAdministrativa: number,
    
    codigoPredioRentas?: string,
    codigoClasificacionPredio?: string,
    codigoPredioCastradoEn?: string,
    codigoUso?: string,
    descripcionUso?: string,
    areaTerrenoVerificado?: number,
    porBienComunTerrLegal?: number,
    porBienComunConsLegal?:number,
    listaArchivos?: ArchivoModel[]
}