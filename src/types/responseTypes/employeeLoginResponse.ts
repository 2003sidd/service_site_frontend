export interface EmployeeLoginResponse {
    employee: EmployeeResponse,
    jwt: string
}
export interface EmployeeResponse {
    _id: string,
    name: string,
    email: string,
    number: string,
    role: string,
    isActive: boolean,

}
