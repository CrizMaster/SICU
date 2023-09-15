import { ItemSelect } from "src/app/core/models/item-select.model"
import { Via } from "./via.model"

export interface SaveFichaIndividual {
    idObjeto?: number,
    usuarioCreacion?: string,
    terminalCreacion?: string,
    codigoDepartamento?: string,
    codigoProvincia?: string,
    codigoDistrito?: string,
    sector?: string,
    manzana?: string,
    lote?: string,
    edifica?: string,
    entrada?: string,
    piso?: string,
    unidad?: string,
    dc?: number,
    crc?: string,
    distrito?: string
}

export interface UbicacionPredioModel {
  idObjeto: number,
  usuarioCreacion?: string,
  terminalCreacion?: string,
  c11TipoEdificacion?: string,
  c12NombreEdifica?: string,
  c13TipoInterior?: string,
  c14NroInterior?: string,

  c15CodigoHabilitacion?: string,
  c16NombreHabilitacion?: string,
  c17SectorZonaEtapa?: string,
  c18ManzanaUrbana?: string,

  c19Lote?: string,
  c20SubLote?: string,
  ubicacionPredioDetalle?: UbicacionPredioDetalleModel[],
  listaVias?: ItemSelect<Via>[]
}

export interface UbicacionPredioDetalleModel{
  idObjeto: number,
  c05CodigoVia?: string,
  c06TipoVia?: string,
  c07Nombrevia?: string,
  c08TipoPuerta?: string,
  c09NroMunicipal?: string,
  c10Numero?: string,
}