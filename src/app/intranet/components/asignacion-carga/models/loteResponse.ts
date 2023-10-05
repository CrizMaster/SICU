export interface LoteResponse {
    id: number,
    codigoEstado: number,
    estado: string,
    nroLote: string,
    totalUC?: number,
    fechaAsignacion?: string,
    fechaSicronizacion?: string
}

export interface LoteFilter {
    orden: number,
    Page: number,
    ItemsByPage: number
}