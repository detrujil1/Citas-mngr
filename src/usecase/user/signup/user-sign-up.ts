import bcrypt from 'bcrypt';
import { ISignUpExecutor } from '../../../domain/port/user/signup/in/signup-executor';
import { ISignUpUser } from '../../../domain/dto/user/signup-user';
import { IUserCreator } from '../../../domain/port/user/signup/out/user-creator';

export class UserSignUp implements ISignUpExecutor {
    constructor(private readonly userCreator: IUserCreator) {}

    async execute(data: ISignUpUser): Promise<void> {
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        // Crear usuario con contraseña encriptada
        await this.userCreator.create({
            ...data,
            password: hashedPassword,
        });
    }
}
