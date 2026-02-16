import { ILoginExecutor } from '../../../domain/port/user/authentication/in/login-executor';
import { ILoginUser } from '../../../domain/dto/user/login-user';
import { IAuthClaim } from '../../../domain/dto/user/auth-claim';
import { IUserFetcher } from '../../../domain/port/user/authentication/out/user-fetcher';
import { IAuthenticator } from '../../../domain/port/user/authentication/out/authenticator';

export class UserLogin implements ILoginExecutor {
    constructor(
        private readonly userFetcher: IUserFetcher,
        private readonly authenticator: IAuthenticator
    ) {}

    async execute(data: ILoginUser): Promise<IAuthClaim> {
        // Buscar usuario por email
        const user = await this.userFetcher.findByEmail(data.email);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verificar contraseña
        const isValidPassword = await this.authenticator.comparePasswords(
            data.password,
            user.password
        );

        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Generar token JWT
        const token = await this.authenticator.generateToken(
            user.id,
            user.email,
            user.role
        );

        return {
            userId: user.id,
            email: user.email,
            role: user.role,
            token,
        };
    }
}
