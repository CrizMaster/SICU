export interface HabilitacionEdificacion {
    habilitacion?: Habilitacion,
    edificacion?: Edificacion   
}

export interface Habilitacion {
    codigoHabilitacion?: string,
    nombreHabilitacion?: string,
    sectorZonaEtapa?: string,
    manzanaUrbana?: string,
    lote?: string,
    sublote?: string
}

export interface Edificacion {
    codigoEspecifico?: string,
    nombreEdificacion?: string,
    idTipoInterior?: number,
    codigoTipoInterior?: string,
    numeroInterior?: string
}