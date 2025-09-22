import type { User } from "../../types";


export interface paginationUserResponse {
    users: User[],
    total: number
}