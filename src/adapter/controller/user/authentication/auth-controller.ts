import { NextFunction, Response, Router } from 'express';
import { IRequest } from '../../../../infrastructure/adapter/http/header';
import { ResponseFactory } from '../../../../infrastructure/adapter/http/response-factory';
import { CustomError } from '../../../../infrastructure/adapter/http/error-handler';
import { AuthService } from '../../../../usecase/auth/auth-service';
import { IRegisterDoctor, IRegisterPatient } from '../../../../domain/dto/auth/register-dto';

export class AuthenticationController {
    private readonly router: Router = Router();

    constructor(private readonly authService: AuthService) {
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/auth/login', this.login.bind(this));
        this.router.post('/auth/register/doctor', this.registerDoctor.bind(this));
        this.router.post('/auth/register/patient', this.registerPatient.bind(this));
        this.router.get('/auth/verify', this.verify.bind(this));
    }

    private async login(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new CustomError(400, 'Email and password are required');
            }

            const authResponse = await this.authService.login(email, password);
            const response = ResponseFactory.success(authResponse);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            const statusCode = err.message === 'Invalid credentials' ? 401 : 500;
            next(new CustomError(statusCode, err.message));
        }
    }

    private async registerDoctor(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body as IRegisterDoctor;

            // Validaciones
            if (!data.name || !data.email || !data.password || !data.specialtyId || !data.licenseNumber) {
                throw new CustomError(400, 'Missing required fields');
            }

            if (data.password.length < 6) {
                throw new CustomError(400, 'Password must be at least 6 characters');
            }

            const authResponse = await this.authService.registerDoctor(data);
            const response = ResponseFactory.success(authResponse);
            res.status(201).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            const statusCode = err.message.includes('already registered') ? 409 : 400;
            next(new CustomError(statusCode, err.message));
        }
    }

    private async registerPatient(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body as IRegisterPatient;

            // Validaciones
            if (!data.name || !data.email || !data.password) {
                throw new CustomError(400, 'Missing required fields');
            }

            if (data.password.length < 6) {
                throw new CustomError(400, 'Password must be at least 6 characters');
            }

            const authResponse = await this.authService.registerPatient(data);
            const response = ResponseFactory.success(authResponse);
            res.status(201).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            const statusCode = err.message.includes('already registered') ? 409 : 400;
            next(new CustomError(statusCode, err.message));
        }
    }

    private async verify(_req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // El middleware de autenticación ya validó el token
            const response = ResponseFactory.success({ valid: true });
            res.status(200).json(response);
        } catch (error: unknown) {
            next(new CustomError(401, 'Invalid or expired token'));
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}
