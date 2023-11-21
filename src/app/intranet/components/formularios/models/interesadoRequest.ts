

    export interface InteresadoRequest {
        usuarioCreacion: string,
        terminalCreacion: string,
        usuarioModificacion: string,
        terminalModificacion: string,
        codigoUnidadAdministrativa: number,
        listaInteresadosDrr: InteresadoResponse[]
    }
    
    export interface InteresadoResponse {
        codigoInteresado?: number,
        apellidoPaterno?: string,
        apellidoMaterno?: string,
        nombres?: string,
        codigoEstadoCivil?: string,
        codigoTipoDocumento?: string,
        numeroDocumento?: string,
        razonSocial?: string,
        numeroTelefono?: string,
        correoElectronico?: string,
        codigoDrr?: number,
        codigoUnidadAdministrativa?: number,
        codigoTipoCotitular?: string,
        nombreTipoCotitular?: string,
        porcetajeCotitular?: number,
        codigoContribRentas?: string,
        codigoPredioRentas?: string,
        usuarioCreacion?: string,
        terminalCreacion?: string,
        usuarioModificacion?: string,
        terminalModificacion?: string,

        nombreTipoDocumento?: string,
        nombreTipoEstadoCivil?: string,
        id?: number
    }