export interface ServiceRequest {
    _id?:string
    name: string,
    description: string,
    isActive: boolean,
    services: service[]
}

interface service {
    price: string,
    name: string
}