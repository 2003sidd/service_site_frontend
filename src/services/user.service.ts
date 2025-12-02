import type { genericResponse } from "../types/genericResponse";
import type { paginationType } from "../types/pagniation.interface";
import type { loginRequest } from "../types/requestTypes/loginRequest.interface";
import type { registerUserInterface } from "../types/requestTypes/registerUser.interface";
import type { ServiceAssign } from "../types/requestTypes/serviceAssign.interface";
import type { ServiceRequest } from "../types/requestTypes/serviceRequest.interface";
import type { DashboardResponse } from "../types/responseTypes/dashbiardResponse.";
import type { EmployeeLoginResponse } from "../types/responseTypes/employeeLoginResponse";
import type { paginationUserResponse } from "../types/responseTypes/paginationResponse";
import type { paginationServiceResponse, ServiceRequestInterface } from "../types/responseTypes/serviceResponse";
import type { TechnicianResponse } from "../types/responseTypes/TechnicianRespons";
import { get, post } from "./api";
import type { Config } from "../types/responseTypes/ConfigResponse";

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
    return get<genericResponse<ServiceRequest[]>>("/api/service/getAllService    ")
}

export const toggleServiceview = async (id: string) => {
    return get<genericResponse<boolean>>(`/api/service/toggleService/${id}`)
}


// delete user 
export const toggleUserAccount = async (id: string) => {
    return get<genericResponse<boolean>>(`api/user/toggleCustomerStatus/${id}`);
}

// export const activateUser = async (id: string) => {
//     return get<genericResponse<boolean>>(`api/user/toggleCustomerStatus/${id}`);
// }

export const getDashBoardData = async () => {
    return get<genericResponse<DashboardResponse>>('api/dashboard/dashboardRoute')
}

export const getServiceRequest = async (data: paginationType) => {
    return post<paginationType, genericResponse<paginationServiceResponse>>('api/serviceRequest/getRequests', data)
}

export const getNewRequests = async (data: paginationType) => {
    return post<paginationType, genericResponse<paginationServiceResponse>>('api/serviceRequest/getNewRequests', data)
}


export const getServiceRequestById = async (id: string) => {
    return get<genericResponse<ServiceRequestInterface>>(`api/serviceRequest/getRequest/${id}`)
}

export const getTechnician = async () => {
    return get<genericResponse<TechnicianResponse[]>>("api/employee/getTechnician")
}

export const assignServiceRequest = async (data: ServiceAssign) => {
    return post<ServiceAssign, genericResponse<boolean>>("api/serviceRequest/assignRequest", data)
}

export const getConfig = async () => {
    return get<genericResponse<Config>>("api/config/config")
}

export const saveConfig = async (data: Config) => {
    return post<Config, genericResponse<Config>>("api/config/upsertConfig", data)
}