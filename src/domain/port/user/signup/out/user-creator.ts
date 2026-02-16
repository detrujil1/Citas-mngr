import { ISignUpUser } from "../../../../dto/user/signup-user";

export interface IUserCreator {
    create(data: ISignUpUser): Promise<void>;
}
