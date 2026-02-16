import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IAuthenticator } from '../../../domain/port/user/authentication/out/authenticator';
import { IAuthClaim } from '../../../domain/dto/user/auth-claim';
import { UserRole } from '../../../domain/entity/user';
import env from '../../../config/env';

export class JWTAuthenticatorAdapter implements IAuthenticator {
    async generateToken(userId: string, email: string, role: string): Promise<string> {
        const payload = {
            userId,
            email,
            role,
        };

        return jwt.sign(payload, env.jwt.JWT_SECRET, {
            expiresIn: env.jwt.JWT_EXPIRATION || '24h',
        } as SignOptions);
    }

    async verifyToken(token: string): Promise<IAuthClaim> {
        try {
            const decoded = jwt.verify(token, env.jwt.JWT_SECRET) as any;
            
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role as UserRole,
                token,
            };
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
