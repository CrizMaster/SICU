export interface PersonaResponse{
    nro: number,
    idPersona: number,
    idTipoDocumento: number,
    tipoDocumento: string,
    numeroDocumento: string,
    nombres: string,
    apePaterno: string,
    apeMaterno: string,
    idCargo: number,
    cargo: string,
    correo: string,
    celular: string,
    archivoFoto: string,
    bloqueado: boolean,
    userName: string,
    total: number,
    idUsuario: number,

    accion?: number
}

export interface PersonaFilter{
    IdTipoDocumento?: number,
    NumeroDocumento?: string,
    Nombres?: string,
    ApePaterno?: string,
    ApeMaterno?: string,
    Pagina: number,
    Registros: number
}

export interface PersonaRequest{
    accion: number,
    idPersona: number,
    idTipoDocumento?: number,
    numeroDocumento?: string,
    nombres?: string,
    apePaterno?: string,
    apeMaterno?: string,
    idCargo?: number,
    correo?: string,
    celular?: string,
    archivoFoto?: string
}

export interface UsuarioRequest{
    accion: number,
    idPersona: number,
    password?: string,
    passwordRepite?: string
    passwordActual?: string
}