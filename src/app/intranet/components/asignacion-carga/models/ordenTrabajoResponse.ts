import { OrdenTrabajo } from "./ordenTrabajo.model";
import { UsuarioAsignado } from "./personalAsignado.model";

export interface OrdenTrabajoResponse {
    total: number,
    data: OrdenTrabajo[]
}

export interface OrdenTrabajoRequest {
    usuarioCreacion: string,
    terminalCreacion: string,
    usuarioModificacion?: string,
    terminalModificacion?: string,
    fechaOrden: string,
    manzanas: ManzanasRequest[],
    usuarios: UsuariosRequest[],

    codigoOrden?: number
}

export interface ManzanasRequest {
    codigoOrden: number,
    codigoRegistroCaracterizacion: number,
    codigoLote: string    
}

export interface UsuariosRequest {
    codigoOrden: number,
    codigoUsuario: number,
    codigoPerfil: number,
    codigoTipo: string,
    fechaAsignacion: string
}

export interface OrdenTrabajoAction {
    usuarioCreacion: string,
    terminalCreacion: string,
    usuarioModificacion?: string,
    terminalModificacion?: string,
    codigoOrden: number
    fechaOrden?: string,
    codigoEstado?: string,

    usuarios?: UsuarioAsignado[]
}

export interface OrdenTrabajoView {

    codigoOrden?: number
    orden?: string,
    fechaOrden?: string,
    estadoOrden?: string,
    codigoEstadoOrden?: string,
    codigoSector?: string,
    codigoManzana?: string,
    nroLote?: string,

    usuarios?: UsuarioAsignado[]
}