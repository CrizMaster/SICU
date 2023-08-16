export interface OwnershipCharacteristicsRequest {
    idObjeto: number,
    usuarioCreacion?: string,
    terminalCreacion?: string,
    usuarioModificacion?: string,
    terminalModificacion?: string,
    c21CodigoCondicion?: string,
    c22FormaAdquisicion?: string,
    c23CodigoTipoDocumento?: string,
    c24TipoPartida?: string,
    c25Numero?: string
}