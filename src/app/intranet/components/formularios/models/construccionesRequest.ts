export interface ConstruccionesRequest {
    usuarioCreacion: string,
    terminalCreacion: string,
    usuarioModificacion: string,
    terminalModificacion: string,
    codigoUnidadAdministrativa: number,
    listaConstrucciones: ConstruccionResponse[]
}

export interface ConstruccionResponse {
    usuarioCreacion?: string,
    terminalCreacion?: string,
    usuarioModificacion?: string,
    terminalModificacion?: string,
    codigoConstruccion?: number,
    codigoUnidadAdministrativa?: number,
    numeroPiso?: number,
    codigoMaterialPredominante?: string,
    codigoEstadoConservacion?: string,
    codigoEstadoConstruccion?: string,
    categoriaMuroColumna?: string,
    categoriaTecho?: string,
    categoriaPuertaVentana?: string,
    codigoCiiu?: number,
    codigoUca?: string,
    areaVerificada?: number,
    mesAnioConstruccion?: Date,
    activo?: number,
    nro?: number,
    habilitar?: boolean
}