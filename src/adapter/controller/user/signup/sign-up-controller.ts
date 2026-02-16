import { NextFunction, Response, Router } from 'express';
import { ISignUpExecutor } from '../../../../domain/port/user/signup/in/signup-executor';
import { ISignUpUser } from '../../../../domain/dto/user/signup-user';
import { IRequest } from '../../../../infrastructure/adapter/http/header';
import { ResponseFactory } from '../../../../infrastructure/adapter/http/response-factory';
import { CustomError } from '../../../../infrastructure/adapter/http/error-handler';

export class SignUpUserController {
    private readonly router: Router = Router();

    constructor(private readonly signUpService: ISignUpExecutor) {
        this.router.post('/auth/signup', async (req: IRequest, res: Response, next: NextFunction) => {
            this.signUp(req, res, next).catch(next);
        });
    }

    private async signUp(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body as ISignUpUser;
            
            // Validaciones básicas
            if (!body.email || !body.password || !body.name || !body.role) {
                throw new CustomError(400, 'Missing required fields');
            }

            await this.signUpService.execute(body);

            const response = ResponseFactory.success({}, 'User registered successfully');
            res.status(201).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(500, err.message));
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}
