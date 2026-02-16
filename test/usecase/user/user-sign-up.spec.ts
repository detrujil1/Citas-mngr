import { UserSignUp } from '../../../src/usecase/user/signup/user-sign-up';
import { IUserCreator } from '../../../src/domain/port/user/signup/out/user-creator';
import { ISignUpUser } from '../../../src/domain/dto/user/signup-user';
import { UserRole } from '../../../src/domain/entity/user';

describe('UserSignUp', () => {
    let userSignUp: UserSignUp;
    let mockUserCreator: jest.Mocked<IUserCreator>;

    beforeEach(() => {
        mockUserCreator = {
            create: jest.fn(),
        };
        userSignUp = new UserSignUp(mockUserCreator);
    });

    describe('execute', () => {
        it('should hash the password and create user', async () => {
            // Arrange
            const signUpData: ISignUpUser = {
                email: 'test@example.com',
                password: 'plainPassword123',
                name: 'Test User',
                role: UserRole.PACIENTE,
            };

            // Act
            await userSignUp.execute(signUpData);

            // Assert
            expect(mockUserCreator.create).toHaveBeenCalledTimes(1);
            const calledWith = mockUserCreator.create.mock.calls[0][0];
            expect(calledWith.email).toBe(signUpData.email);
            expect(calledWith.name).toBe(signUpData.name);
            expect(calledWith.role).toBe(signUpData.role);
            expect(calledWith.password).not.toBe('plainPassword123');
            expect(calledWith.password.length).toBeGreaterThan(20); // Hashed password
        });

        it('should throw error if user creation fails', async () => {
            // Arrange
            const signUpData: ISignUpUser = {
                email: 'test@example.com',
                password: 'plainPassword123',
                name: 'Test User',
                role: UserRole.PACIENTE,
            };
            mockUserCreator.create.mockRejectedValue(new Error('Database error'));

            // Act & Assert
            await expect(userSignUp.execute(signUpData)).rejects.toThrow('Database error');
        });
    });
});
