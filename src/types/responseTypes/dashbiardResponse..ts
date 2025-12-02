import type { ServiceRequestInterface } from "./serviceResponse"

export interface DashboardResponse {
    user: UserInterface[],
    userCount: number,
    employeeCount: number,
    serviceCount: number,
    serviceRequestCount:number,
    serviceRequest:ServiceRequestInterface[]
};

interface UserInterface {
    name: string,
    email: string
}