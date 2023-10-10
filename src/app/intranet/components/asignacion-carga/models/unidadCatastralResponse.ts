export interface UnidadCatastralResponse {
    id: number,
    nroCatastral: string,
    fechaAsignacion?: string,
    fechaSicronizacion?: string
}

export interface UnidadCatastralFilter {
    orden: number,
    Page: number,
    ItemsByPage: number
}