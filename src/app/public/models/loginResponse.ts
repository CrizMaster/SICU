import { User } from "./user";


export interface LoginResponse{
    isSuccess: boolean,
    Message: string,
    Data: User
}