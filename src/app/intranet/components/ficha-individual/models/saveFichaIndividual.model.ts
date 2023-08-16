export interface SaveFichaIndividual {
    idObjeto: number,
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
    dc?: number
}

export interface UbicacionPredioModel {
  idObjeto: number,
  usuarioCreacion?: string,
  terminalCreacion?: string,
  c11TipoEdificacion?: string,
  c12NombreEdifica?: string,
  c13TipoInterior?: string,
  c14NroInterior?: string,
  c15CodigoHu?: string,
  c16NombreHu?: string,
  c17ZonaSectorEtapa?: string,
  c18Manzana?: string,
  c19Lote?: string,
  c20SubLote?: string,
  ubicacionPredioDetalle?: UbicacionPredioDetalleModel[]
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