export interface HabilitacionEdificacion {
    habilitacion?: Habilitacion,
    edificacion?: Edificacion   
}

export interface Habilitacion {
    c15CodigoHabilitacion?: string,
    c16NombreHabilitacion?: string,
    c17SectorZonaEtapa?: string,
    c18ManzanaUrbana?: string,
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