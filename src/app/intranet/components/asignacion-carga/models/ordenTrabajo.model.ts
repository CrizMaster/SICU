import { UsuarioAsignado } from "./personalAsignado.model";

export interface OrdenTrabajo {
    id: number,
    codigoRegistroCaracterizacion: number,
    codigoDepartamento: string,
    departamento: string,
    codigoProvincia: string,
    provincia: string,
    codigoDistrito: string,
    distrito: string,
    codigoSector: string,
    codigoManzana: string,
    lotes: number,
    codigoEstadoOrden: string,
    estadoOrden: string,
    personal: string,
    personasAsignadas: number,
    orden: string,
    fechaOrden: string,    
    registros: number,
    codigoOrden: number,
    usuarios?: UsuarioAsignado[],
    
    seleccion: boolean,
    expandir: boolean
}