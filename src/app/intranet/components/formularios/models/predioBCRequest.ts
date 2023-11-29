import { ArchivoModel } from "./caracterizacionResponse";

export interface PredioBCRequest {
    codigoClasificacionPredio?: string,
    codigoPredioCastradoEn?: string,
    codigoUso?: string,
    descripcionUso?: string,
    areaTerrenoVerificado?: number,
    codigoTipoDocumento?: string,
    numeroDocumento?: string,
    codigoTipoPartidaRegistral?: string,
    numeroPartida?: string,

    codigoUnidadAdministrativa?: number,
    listaArchivos?: ArchivoModel[]
}