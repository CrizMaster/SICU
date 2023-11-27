export interface RecapitulacionBCResponse {
    nro?: string,
    codigoEdifica?: string,
    entrada?: string,
    piso?: string,
    unidad?: string,
    areaTerrenoVerificada?: number,
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