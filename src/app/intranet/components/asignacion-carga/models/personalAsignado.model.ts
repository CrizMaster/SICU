export interface PersonalAsignado {
    perfil?: string,
    idPerfil?: number,
    personal?: string,
    idPersonal?: number,
    tipo?: string,
    idTipo?: number
}

export interface UsuarioAsignado {
    codigoUsuarioOrden?: number,
    codigoOrden?: number,
    codigoUsuario?: number,
    persona?: string,
    codigoPerfil?: number,
    perfil?: string,
    codigoTipo?: string,
    fechaAsignacion?: string,
    tipo?: string
}