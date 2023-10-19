export interface UsuarioSession {
    IdPersona: number,
    ApePaterno: string,
    ApeMaterno: string,
    Nombres: string,
    Correo: string,
    ArchivoFoto: string,
    NombreCargo: string,
    FechaUltAcceso: Date,
    Bloqueado: boolean,
    Token: string
}