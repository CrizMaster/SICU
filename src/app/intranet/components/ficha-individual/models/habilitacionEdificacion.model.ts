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
    codigoTipoEdificacion?: string,
    nombreEdificacion?: string,
    idTipoInterior?: number,
    codigoTipoInterior?: string,
    numeroInterior?: string
}