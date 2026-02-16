import { UserRole } from "../../entity/user";

export interface ISignUpUser {
    email: string;
    password: string;
    name: string;
    role: UserRole;
}
