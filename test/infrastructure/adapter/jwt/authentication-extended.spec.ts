
import { JWTAuthenticatorAdapter } from '../../../../src/infrastructure/adapter/jwt/authentication';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'signed.token'),
    verify: jest.fn(() => ({ userId: 'u1', email: 'john@doe.com', role: 'PACIENTE' })),
}));
jest.mock('bcrypt', () => ({
    compare: jest.fn((plain, hash) => plain === 'plain' && hash === 'hash'),
}));

describe('JWTAuthenticatorAdapter', () => {
    const adapter = new JWTAuthenticatorAdapter();
    const userId = 'u1';
    const email = 'john@doe.com';
    const role = 'PACIENTE';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should sign and verify a token', async () => {
        const token = await adapter.generateToken(userId, email, role);
        expect(token).toBe('signed.token');
        const decoded = await adapter.verifyToken(token);
        expect(decoded.userId).toBe(userId);
        expect(decoded.email).toBe(email);
        expect(decoded.role).toBe(role);
    });

    it('should throw on invalid token', async () => {
        const jwt = require('jsonwebtoken');
        jwt.verify.mockImplementationOnce(() => { throw new Error('Invalid or expired token'); });
        await expect(adapter.verifyToken('invalid.token')).rejects.toThrow('Invalid or expired token');
    });

    it('should compare passwords correctly', async () => {
        const bcrypt = require('bcrypt');
        bcrypt.compare.mockResolvedValueOnce(true);
        await expect(adapter.comparePasswords('plain', 'hash')).resolves.toBe(true);
        bcrypt.compare.mockResolvedValueOnce(false);
        await expect(adapter.comparePasswords('plain', 'hash')).resolves.toBe(false);
    });
});
