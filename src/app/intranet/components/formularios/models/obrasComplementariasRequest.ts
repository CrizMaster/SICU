export interface ObrasComplementariasRequest {
    usuarioCreacion: string,
    terminalCreacion: string,
    usuarioModificacion: string,
    terminalModificacion: string,
    codigoUnidadAdministrativa: number,
    listaObrasComplementarias: ObrasComplementariasResponse[]
}

export interface ObrasComplementariasResponse {
    usuarioCreacion?: string,
    terminalCreacion?: string,
    usuarioModificacion?: string,
    terminalModificacion?: string,
    codigoOtrasInstalaciones?: number,
    codigoUnidadAdministrativa?: number,
    numeroPiso?: number,
    codigoObra?: number,
    mesAnioConstruccion?: Date,
    codigoMaterialPredominante?: string,
    codigoEstadoConservacion?: string,
    codigoEstadoConstruccion?: string,
    productoTotal?: number,
    codigoUnidadMedida?: string,
    codigoUca?: string,
    activo?: number,
    descripcionObra?: string,
    nombreEspecifico?: string,
    nro?: number,
    habilitar?: boolean
}