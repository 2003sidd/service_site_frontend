import type { service, ServiceRequest } from "../requestTypes/serviceRequest.interface"

export interface ServiceRequestInterface {
    _id: string,
    name: string,
    email: string,
    number: string,
    description:string,
    customer: {
        name: string,
        email: string,
        number: string,
    },
    serviceId: ServiceRequest,
    subServiceId: string
    csrPath: string,
    address: string
    assignTo: {

    },
    comment: string,
    amount: string,
    status: string
}