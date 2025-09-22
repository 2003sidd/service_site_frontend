import type { Employee, User } from "../../types";


export interface paginationEmployeeResponse {
    users: Employee[],
    total: number
}