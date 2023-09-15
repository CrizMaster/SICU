import { Habilitacion } from "./habilitacionEdificacion.model"

export interface SharedData<T> {
    complete: boolean,
    idFicha: number,
    info: T
}

export interface SharedThirdData {
    // complete: boolean,
    // idFicha: number,
    codigoCondicionTitular: string
}

export interface SharedFirstData<T> {    
    complete: boolean,
    idFicha: number,
    habUrbana?: Habilitacion,
    data?: T
}