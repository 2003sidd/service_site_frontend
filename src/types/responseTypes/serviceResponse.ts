import type { ServiceRequest } from "../requestTypes/serviceRequest.interface"
export interface paginationServiceResponse {
    data: ServiceRequestInterface[],
    total: number
}
export interface ServiceRequestInterface {
    _id: string,
    name: string,
    email: string,
    uuid:string,
    number: string,
    description:string,
    customer: {
        name: string,
        email: string,
        number: string,
    },
    serviceId: ServiceRequest,
    subServiceId: string
    subServiceName: string
    csrPath: string,
    address: string
    assignTo: techInfo,
    assignmentRequest:techInfo, 
    comment: string,
    amount: string,
    status: string
}

interface techInfo {
    name:string,
    number:string
}