export interface EdificacionRequest {
    usuarioCreacion?: string,
    terminalCreacion?: string,    
    codigoEdificacion: number,
    codigoTipoEdificacion?: string,
    nombreEdificacion?: string
}

export interface EdificacionFilter {
    codigoLote: number
}

export interface EdificacionLoteRequest {
    usuarioCreacion: string,
    terminalCreacion: string,
    numeroEdificaciones: number,
    codigoLote: number
}