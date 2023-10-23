export interface UsuarioSession {
    apePaterno?: string,
    apeMaterno?: string,
    nombres?: string,
    correo?: string,
    archivoFoto?: string,
    nombreCargo?: string,
    fechaUltAcceso?: Date,
    bloqueado?: boolean,
    token?: string
}