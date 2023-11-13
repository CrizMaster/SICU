export interface ReniecModel {
    consultarResponse?: ReniecConsulta
}

export interface ReniecConsulta {
    return?: RetornoModel
}

export interface RetornoModel {
    coResultado?: string,
    datosPersona?: PersonaReniec,
    deResultado: string
}

export interface PersonaReniec {
    apPrimer: string,
    apSegundo: string,
    direccion: string,
    estadoCivil: string,
    foto: string,
    prenombres: string,
    restriccion: string,
    ubigeo: string    
}