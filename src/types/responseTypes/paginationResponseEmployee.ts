import type { Employee } from "../../types";


export interface paginationEmployeeResponse {
    users: Employee[],
    total: number
}