export interface LoteResponse {
    id?: number,
    codigoDetalle: number,
    codigoEstado: string,
    estado: string,
    codigoLote: number,
    unidadesAdministrativas?: number,
    fechaOrden?: string,
    fechaSincronizacion?: string,
    codigoCaracterizacion: number,
    codigoLoteCaracterizacion: string
}

export interface LoteFilter {
    orden?: number,
    Page?: number,
    ItemsByPage?: number,
    codigoOrden?: number
}

export interface CaracterizacionFilter {
    codigoLote: string,
    codigoCaracterizacion: number
}