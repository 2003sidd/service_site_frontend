export interface ServiceRequest {
    _id?:string
    name: string,
    description: string,
    isActive: boolean,
    services: service[]
}

export interface service {
    _id ?:string
    price: string,
    name: string
}