import { ImagenModel } from "src/app/core/models/imagen.model"


    export interface InteresadoRequest {
        usuarioCreacion: string,
        terminalCreacion: string,
        usuarioModificacion: string,
        terminalModificacion: string,
        codigoUnidadAdministrativa: number,
        listaInteresadosDrr?: InteresadoSave[]
    }
    
    export interface InteresadoResponse {
        codigoInteresado?: number,
        apellidoPaterno?: string,
        apellidoMaterno?: string,
        nombres?: string,
        codigoTipoGenero?: string,
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
        id?: number,

        codigoCondicionTitular?: string,
        codigoFormaAdquisicion?: string,
        codigoTipoDocumentoTitular?: string,
        codigoTipoPartidaRegistral?: string,
        numeroPartida?: string,        

        listConyuge?: ConyugeResponse[],
        listArchivo?: ImagenModel[]
    }

    export interface InteresadoSave {
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
        porcetajeCotitular?: number,
        codigoContribRentas?: string,
        codigoPredioRentas?: string,
        usuarioCreacion?: string,
        terminalCreacion?: string,
        usuarioModificacion?: string,
        terminalModificacion?: string,
        nombreTipoDocumento?: string,
        nombreTipoEstadoCivil?: string,
        nombreTipoCotitular?: string,
        codigoCondicionTitular?: string,
        codigoFormaAdquisicion?: string,
        codigoTipoDocumentoTitular?: string,
        codigoTipoPartidaRegistral?: string,
        numeroPartida?: string,
        codigoTipoGenero?: string,

        listConyuge?: ConyugeResponse[],
        listArchivo?: ImagenModel[]
    }

    export interface ConyugeResponse{
        codigoConyuge?: number,
        codigoInteresado?: number,
        apellidoPaterno?: string,
        apellidoMaterno?: string,
        nombres?: string,
        codigoTipoDocumento?: string,
        numeroDocumento?: string,
        codigoTipoGenero?: string,
        usuarioCreacion?: string,
        terminalCreacion?: string,
        usuarioModificacion?: string,
        terminalModificacion?: string,
        activo?: 0        
    }

    export interface InteresadoSave {
        codigoInteresado?: number,
        apellidoPaterno?: string,
        apellidoMaterno?: string,
        nombres?: string,
        codigoSexo?: string,
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
        id?: number,

        codigoCodicionTitular?: string,
        codigoFormaAdquisicion?: string,
        codigoTipoDocumentoTitular?: string,
        codigotTipoPartidaRegistral?: string,
        numeroPartida?: string,        

        listConyuge?: ConyugeResponse[]
    }