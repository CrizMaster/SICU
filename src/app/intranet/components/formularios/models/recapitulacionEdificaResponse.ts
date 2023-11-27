export interface RecapitulacionEdificaResponse {
    codigoDepartamento?: string,
    codigoProvincia?: string,
    codigoDistrito?: string,
    codigoSector?: string,
    codigoManzana?: string,
    codigoLote?: string,
    numeroEdificacion?: string,
    areaTerrenoOcupado?: number,
    porcentajeAreaTerrenoOcupado?: number,
    codigoEstado?: string,
    nombreEstado?: string,    
    
    codigoBienComun?: number,
    terminalCreacion?: string,
    terminalModificacion?: string,    
    usuarioCreacion?: string,    
    usuarioModificacion?: string
}