import { ILoginUser } from "../../../../dto/user/login-user";
import { IAuthClaim } from "../../../../dto/user/auth-claim";

export interface ILoginExecutor {
    execute(data: ILoginUser): Promise<IAuthClaim>;
}
