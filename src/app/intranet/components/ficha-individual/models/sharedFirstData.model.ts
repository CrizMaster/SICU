export interface SharedFirstData {
    idFicha: number,
    codigoSector: string,
    codigoManzana: string
}

export interface SharedThirdData {
    codigoCondicionTitular: string
}

export interface SharedData<T> {
    complete: boolean,
    data: T
}