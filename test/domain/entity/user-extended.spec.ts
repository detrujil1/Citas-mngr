import { User, IUser, UserRole } from '../../../src/domain/entity/user';

describe('User entity', () => {
    const baseData: IUser = {
        id: 'u1',
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'hash',
        phone: '123',
        role: UserRole.PACIENTE,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z'),
    };

    it('should expose all getters correctly', () => {
        const user = new User(baseData);
        expect(user.id).toBe(baseData.id);
        expect(user.name).toBe(baseData.name);
        expect(user.email).toBe(baseData.email);
        expect(user.password).toBe(baseData.password);
        expect(user.phone).toBe(baseData.phone);
        expect(user.role).toBe(baseData.role);
        expect(user.createdAt).toEqual(baseData.createdAt);
        expect(user.updatedAt).toEqual(baseData.updatedAt);
    });

    it('should return undefined for phone if not set', () => {
        const user = new User({ ...baseData, phone: undefined });
        expect(user.phone).toBeUndefined();
    });
});
