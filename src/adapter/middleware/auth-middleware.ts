import { Response, NextFunction } from 'express';
import { ICustomRequest } from '../../infrastructure/adapter/http/header';
import { JWTAuthenticatorAdapter } from '../../infrastructure/adapter/jwt/authentication';
import { UserRole } from '../../domain/entity/user';

const authenticator = new JWTAuthenticatorAdapter();

export function authenticate(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: {
                message: 'Missing or invalid authorization header',
            },
        });
        return;
    }

    const token = authHeader.substring(7);

    authenticator.verifyToken(token)
        .then(authClaim => {
            req.user = {
                userId: authClaim.userId,
                email: authClaim.email,
                role: authClaim.role,
            };
            next();
        })
        .catch(() => {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid or expired token',
                },
            });
        });
}

export function requireRole(...allowedRoles: UserRole[]) {
    return (req: ICustomRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Authentication required',
                },
            });
            return;
        }

        const userRole = req.user.role as UserRole;

        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({
                success: false,
                error: {
                    message: 'Insufficient permissions',
                },
            });
            return;
        }

        next();
    };
}
