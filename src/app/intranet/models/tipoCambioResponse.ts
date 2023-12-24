export interface TipoCambioResponse{
    nro: number,
    total: number,
    fechaCambioInicio: string,
    fechaCambioFin: string,
    tCCompra: number,
    tCVenta: number,
    personaCrea: string
}

export interface TipoCambioFilter{
    Id?: number,
    Pagina: number,
    Registros: number
}

export interface TipoCambioRequest{
    tcCompra: number,
    tcVenta: number
}