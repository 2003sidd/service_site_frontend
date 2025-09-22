import type { genericResponse } from "../types/genericResponse";
import type { paginationType } from "../types/pagniation.interface";
import type { registerEmployeeInterface } from "../types/requestTypes/registerEmployee.interface";
import type { paginationEmployeeResponse } from "../types/responseTypes/paginationResponseEmployee";
import { get, post } from "./api";


// get all employee 
export const getEmployee = async (payLoad: paginationType) => {
    return post<paginationType, genericResponse<paginationEmployeeResponse>>("api/employee/getEmployee", payLoad);
}

// add employee 
export const upsertEmployee = async (payLoad: registerEmployeeInterface) => {
    return post<registerEmployeeInterface, genericResponse<boolean>>("api/employee/registerEmployee", payLoad);
}

export const deleteEmployee = async (id: string) => {
    return get<genericResponse<boolean>>(`api/employee/toggleStatus/${id}`);
}
