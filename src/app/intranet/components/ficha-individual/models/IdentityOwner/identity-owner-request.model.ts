
export interface IdentityOwnerRequest {
    usuarioCreacion?: string,
    terminalCreacion?: string,
    usuarioModificacion?: string,
    terminalModificacion?: string,
    idObjeto: number,
    c26TipoTitular?: string,
    c27EstadoCivil?: string,
    c28aTipoDocumento?: string,
    c28bTipoDocumento?: string,
    c29aNroDocumento?: string,
    c29bNroDocumento?: string,
    c30aNombres?: string,
    c30bNombres?: string,
    c31aApellidoPaterno?: string,
    c31bApellidoPaterno?: string,
    c32aApellidoMaterno?: string,
    c32bApellidoMaterno?: string,
    c33PersonaJuridica?: string,
    c34Ruc?: string,
    c35TelefonoAnexo?: string,
    c36RazonSocial?: string,
    c37CorreoElectronico?: string
}