import { IAuthClaim } from "../../../../dto/user/auth-claim";

export interface IAuthenticator {
    generateToken(userId: string, email: string, role: string): Promise<string>;
    verifyToken(token: string): Promise<IAuthClaim>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
