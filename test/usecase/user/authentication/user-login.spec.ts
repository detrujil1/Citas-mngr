import { UserLogin } from '../../../../src/usecase/user/authentication/user-login';
import { IUserFetcher } from '../../../../src/domain/port/user/authentication/out/user-fetcher';
import { IAuthenticator } from '../../../../src/domain/port/user/authentication/out/authenticator';
import { User, UserRole } from '../../../../src/domain/entity/user';

describe('UserLogin', () => {
    let userLogin: UserLogin;
    let userFetcher: jest.Mocked<IUserFetcher>;
    let authenticator: jest.Mocked<IAuthenticator>;

    beforeEach(() => {
        userFetcher = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
        } as jest.Mocked<IUserFetcher>;

        authenticator = {
            generateToken: jest.fn(),
            verifyToken: jest.fn(),
            comparePasswords: jest.fn(),
        } as jest.Mocked<IAuthenticator>;

        userLogin = new UserLogin(userFetcher, authenticator);
    });

    describe('execute', () => {
        it('should login user successfully with valid credentials', async () => {
            const mockUser = new User({
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: UserRole.PACIENTE,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const loginData = {
                email: 'john@example.com',
                password: 'plainPassword',
            };

            userFetcher.findByEmail.mockResolvedValue(mockUser);
            authenticator.comparePasswords.mockResolvedValue(true);
            authenticator.generateToken.mockResolvedValue('jwt-token-123');

            const result = await userLogin.execute(loginData);

            expect(result).toEqual({
                userId: 'user-123',
                email: 'john@example.com',
                role: UserRole.PACIENTE,
                token: 'jwt-token-123',
            });

            expect(userFetcher.findByEmail).toHaveBeenCalledWith('john@example.com');
            expect(authenticator.comparePasswords).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
            expect(authenticator.generateToken).toHaveBeenCalledWith('user-123', 'john@example.com', UserRole.PACIENTE);
        });

        it('should throw error if user not found', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password',
            };

            userFetcher.findByEmail.mockResolvedValue(null);

            await expect(userLogin.execute(loginData))
                .rejects.toThrow('Invalid credentials');
        });

        it('should throw error if password is invalid', async () => {
            const mockUser = new User({
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: UserRole.PACIENTE,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const loginData = {
                email: 'john@example.com',
                password: 'wrongPassword',
            };

            userFetcher.findByEmail.mockResolvedValue(mockUser);
            authenticator.comparePasswords.mockResolvedValue(false);

            await expect(userLogin.execute(loginData))
                .rejects.toThrow('Invalid credentials');
        });

        it('should work with MEDICO role', async () => {
            const mockUser = new User({
                id: 'doctor-123',
                name: 'Dr. Smith',
                email: 'smith@example.com',
                password: 'hashedPassword',
                role: UserRole.MEDICO,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const loginData = {
                email: 'smith@example.com',
                password: 'password',
            };

            userFetcher.findByEmail.mockResolvedValue(mockUser);
            authenticator.comparePasswords.mockResolvedValue(true);
            authenticator.generateToken.mockResolvedValue('medico-token');

            const result = await userLogin.execute(loginData);

            expect(result.role).toBe(UserRole.MEDICO);
            expect(result.token).toBe('medico-token');
        });

        it('should work with ADMIN role', async () => {
            const mockUser = new User({
                id: 'admin-123',
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'hashedPassword',
                role: UserRole.ADMIN,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const loginData = {
                email: 'admin@example.com',
                password: 'password',
            };

            userFetcher.findByEmail.mockResolvedValue(mockUser);
            authenticator.comparePasswords.mockResolvedValue(true);
            authenticator.generateToken.mockResolvedValue('admin-token');

            const result = await userLogin.execute(loginData);

            expect(result.role).toBe(UserRole.ADMIN);
            expect(result.token).toBe('admin-token');
        });
    });
});
