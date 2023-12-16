export interface StatusResponse<T> {
    success?: boolean,
    message?: string,
    data?: T,
    total?: number,
    totalPaginas?: number,
    totalRegistros?: number,
    validations?: string[]
}