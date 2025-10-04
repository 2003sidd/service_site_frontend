import type { User } from "../types";
import type { genericResponse } from "../types/genericResponse";
import type { paginationType } from "../types/pagniation.interface";
import type { loginRequest } from "../types/requestTypes/loginRequest.interface";
import type { registerUserInterface } from "../types/requestTypes/registerUser.interface";
import type { ServiceRequest } from "../types/requestTypes/serviceRequest.interface";
import type { DashboardResponse } from "../types/responseTypes/dashbiardResponse.";
import type { EmployeeLoginResponse } from "../types/responseTypes/employeeLoginResponse";
import type { paginationUserResponse } from "../types/responseTypes/paginationResponse";
import type { ServiceRequestInterface } from "../types/responseTypes/serviceResponse";
import { get, post } from "./api";



// login - superadmin and admin
export const loginAdmins = async (payLoad: loginRequest) => {
    return post<loginRequest, genericResponse<EmployeeLoginResponse>>("api/employee/loginEmployee", payLoad);
}

// get all user 
export const getUsers = async (payLoad: paginationType) => {
    return post<paginationType, genericResponse<paginationUserResponse>>("api/user/users", payLoad);
}

// add user 
export const upsertUser = async (payLoad: registerUserInterface) => {
    return post<registerUserInterface, genericResponse<boolean>>("api/user/upsertUserByAdmin", payLoad);
}

export const serviceCreation = async (payload: ServiceRequest) => {
    return post<ServiceRequest, genericResponse<boolean>>("/api/service/upsertService", payload)
}
export const getService = async () => {
    return get<genericResponse<ServiceRequest[]>>("/api/service/getService")
}

export const toggleServiceview = async (id: string) => {
    return get<genericResponse<boolean>>(`/api/service/toggleService/${id}`)
}


// delete user 
export const deleteUser = async (id: string) => {
    return get<genericResponse<boolean>>(`api/user/toggleCustomerStatus/${id}`);
}

export const getDashBoardData = async () => {
    return get<genericResponse<DashboardResponse>>('api/dashboard/dashboardRoute')
}

export const getServiceRequest = async () =>{
    return get<genericResponse<ServiceRequestInterface[]>>('api/serviceRequest/getRequests')
}


export const getServiceRequestById = async (id:string) =>{
    return get<genericResponse<ServiceRequestInterface>>(`api/serviceRequest/getRequest/${id}`)
}

