export interface ViasCaracterizacion {
    numeroOrden?: number;
    codigoPuerta?: number;
    codigoRegistroCaracterizacion?: number;
    codigoLote?: string;
    codigoTipoVia?: string;
    nombreVia?: string;
    codigoTipoPuerta?: string;
    numeroMunicipal?: string;
    codigoCondicion?: string;
    codigoEstado?: string;
    checkedAct?: boolean;
    idTipoPuerta?: number;
    idCondicion?: number;
    codigoVia?: string
}

export interface ViasCaracterizacionRequest {
    usuarioCreacion?: string;
    terminalCreacion?: string;
    codigoLote?: number;
    codigoVia?: string;
    numeroOrden?: number;
    codigoTipoPuerta?: string;
    numeroMunicipal?: string;
    codigoCondicion?: string;
    activo: number;
}