export interface genericResponse<T> {
    data: T;
    message: string;
    statusCode: number
}