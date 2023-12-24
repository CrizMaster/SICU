export interface ItemSelect<T> {
    value: number,
    text: string,
    code?: number,
    codeStr?: string,
    group?: number,
    data?: T
}