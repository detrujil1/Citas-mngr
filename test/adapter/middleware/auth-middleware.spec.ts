import { UserRole } from '../../../src/domain/entity/user';
import { authenticate, requireRole } from '../../../src/adapter/middleware/auth-middleware';
// import { Request, Response } from 'express';

describe('authenticate middleware', () => {
    it('debería rechazar si no hay token', () => {
        const req = { headers: {} } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();
        authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    // ...otros tests para token válido/inválido
});

describe('requireRole middleware', () => {
    it('debería rechazar si el usuario no tiene rol permitido', () => {
        const req = { user: { role: 'PACIENTE' } } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();
        requireRole(UserRole.MEDICO)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });
    // ...otros tests para rol correcto
});
