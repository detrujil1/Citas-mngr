import { IUserFetcher } from '../../../../domain/port/user/authentication/out/user-fetcher';
import { User, IUser } from '../../../../domain/entity/user';
import { UserModel } from '../schemas/user-schema';

export class MongoUserFetcher implements IUserFetcher {
    async findByEmail(email: string): Promise<User | null> {
        const userDoc = await UserModel.findOne({ email });
        if (!userDoc) {
            return null;
        }
        return new User(this.mapToEntity(userDoc));
    }

    async findById(id: string): Promise<User | null> {
        const userDoc = await UserModel.findById(id);
        if (!userDoc) {
            return null;
        }
        return new User(this.mapToEntity(userDoc));
    }

    private mapToEntity(doc: any): IUser {
        return {
            id: doc._id.toString(),
            email: doc.email,
            password: doc.password,
            name: doc.name,
            role: doc.role,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
