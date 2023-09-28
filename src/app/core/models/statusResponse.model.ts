export interface StatusResponse<T> {
    success: boolean,
    message?: string,
    total: number,
    validations?: string[],
    data: T
}