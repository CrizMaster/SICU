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
    total: number
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