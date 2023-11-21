export interface ArmonizacionRequest {
    codigoUbigeo?: string,
    tipoDocumento?: string,
    numeroDocumento?: string,
    domicilioFiscal?: string
}

export interface ArmonizacionResponse {
    codigoUbigeo?: string,
    nombreDistrito?: string,
    codigoContribuyente?: string,
    nombres?: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    codigoDocumento: string,
    tipoDocumento: string,
    numeroDocumento: string,
    codigoEstadoCivil: string,
    estadoCivil: string,
    fechaNacimiento?: Date,
    fechaFallecimiento?: Date,
    domicilioFiscal: string,
    genero: string,
    correo: string,
    telefono: string,
    direccion: DireccionResponse[]  
}

export interface DireccionResponse {
    codigoContribuyente?: string,
    nombres?: string,
    apellidoPaterno?: string,
    apellidoMaterno?: string,
    codigoDocumento?: string,
    tipoDocumento?: string,
    numeroDocumento?: string,
    codigoEstadoCivil?: string,
    estadoCivil?: string,
    fechaNacimiento?: Date,
    genero?: string,
    correo?: string,
    telefono?: string,

    codigoPredio?: string,
    codigoDireccion?: number,
    direccion?: string,
    index?: number
}