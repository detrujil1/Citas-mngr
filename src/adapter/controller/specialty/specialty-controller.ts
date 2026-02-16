import { NextFunction, Response, Router } from 'express';
import { SpecialtyService } from '../../../usecase/specialty/specialty-service';
import { IRequest } from '../../../infrastructure/adapter/http/header';
import { ResponseFactory } from '../../../infrastructure/adapter/http/response-factory';
import { CustomError } from '../../../infrastructure/adapter/http/error-handler';
import { ICreateSpecialty, IUpdateSpecialty } from '../../../domain/dto/specialty/specialty-dto';

export class SpecialtyController {
    private readonly router: Router = Router();

    constructor(private readonly specialtyService: SpecialtyService) {
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/specialties', this.create.bind(this));
        this.router.get('/specialties', this.findAll.bind(this));
        this.router.get('/specialties/:id', this.findById.bind(this));
        this.router.put('/specialties/:id', this.update.bind(this));
        this.router.delete('/specialties/:id', this.delete.bind(this));
    }

    private async create(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body as ICreateSpecialty;
            const specialty = await this.specialtyService.create(body);
            const response = ResponseFactory.success(specialty, 'Specialty created successfully');
            res.status(201).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(400, err.message));
        }
    }

    private async findAll(_req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const specialties = await this.specialtyService.findAll();
            const response = ResponseFactory.success(specialties);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(500, err.message));
        }
    }

    private async findById(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const specialty = await this.specialtyService.findById(id);
            const response = ResponseFactory.success(specialty);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(404, err.message));
        }
    }

    private async update(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const body = req.body as IUpdateSpecialty;
            const specialty = await this.specialtyService.update(id, body);
            const response = ResponseFactory.success(specialty, 'Specialty updated successfully');
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(400, err.message));
        }
    }

    private async delete(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.specialtyService.delete(id);
            const response = ResponseFactory.success({}, 'Specialty deleted successfully');
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(404, err.message));
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}
