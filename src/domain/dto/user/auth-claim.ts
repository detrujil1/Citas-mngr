import { UserRole } from "../../entity/user";

export interface IAuthClaim {
    userId: string;
    email: string;
    role: UserRole;
    token: string;
}
