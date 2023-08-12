export interface SharedFirstData {
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