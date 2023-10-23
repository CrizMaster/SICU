export interface StatusResponse<T> {
    success?: boolean,
    message?: string,
    data?: T,
    total?: number,
    validations?: string[]
}