export interface ProductoResponse{
    nro: number,
    codigo: string,
    nombreProducto: string,
    valorCompra: number,
    idMoneda: number,
    moneda: string,
    codigoMoneda: number,
    esVigente: boolean,
    fechaCrea: string,
    personaCrea: string,
    idProducto: number,

    accion: number
}

export interface ProductoFilter{
    Codigo?: string,
    NombreProducto?: string,
    Pagina: number,
    Registros: number
}

export interface ProductoRequest{
    idProducto: number,
    codigo?: string,
    nombreProducto?: string,
    valorCompra?: number,
    idMoneda?: number,
    accion?: number
}