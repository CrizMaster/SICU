import { UsuarioSession } from "./usuarioSession";


export interface LoginResponse{
    isSuccess: boolean,
    Message: string,
    Data: UsuarioSession
}