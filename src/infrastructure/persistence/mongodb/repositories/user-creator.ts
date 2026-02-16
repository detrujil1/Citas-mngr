import { IUserCreator } from '../../../../domain/port/user/signup/out/user-creator';
import { ISignUpUser } from '../../../../domain/dto/user/signup-user';
import { UserModel } from '../schemas/user-schema';

export class MongoUserCreator implements IUserCreator {
    async create(data: ISignUpUser): Promise<void> {
        const user = new UserModel(data);
        await user.save();
    }
}
