import { ItemSelect } from "src/app/core/models/item-select.model";
import { Via } from "./via.model";

export interface UbicacionPredial {
    id:number,
    IdVia?: number,
    CodeVia?: string,
    CodeVia1?: string,
    CodeVia2?: string,
    CodeVia3?: string,
    CodeVia4?: string,
    CodeVia5?: string,
    CodeVia6?: string,
    IdTipoVia?: number,
    TipoVia?: string,
    NombreVia?: string,
    IdTipoPuerta?: number,
    TipoPuerta?: string,
    NroMunicipal?: string,
    IdCondNumeracion?: number,
    CondNumeracion?: string,
    swSinCodigo?: boolean,

    IdTipoInterior?: number,
    CodeTipoInterior?: string,
    NumeroInterior?: string,
    Lote?: string,
    Sublote?: string,

    listaVias?: ItemSelect<Via>[]
}