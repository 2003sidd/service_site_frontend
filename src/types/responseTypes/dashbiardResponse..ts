export interface DashboardResponse {
    user: UserInterface[],
    userCount: number,
    employeeCount: number,
    serviceCount: number,
    serviceRequestCount:number
};

interface UserInterface {
    name: string,
    email: string
}