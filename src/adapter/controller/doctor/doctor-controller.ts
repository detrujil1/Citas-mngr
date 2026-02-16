import { NextFunction, Response, Router } from 'express';
import { DoctorService } from '../../../usecase/doctor/doctor-service';
import { IRequest } from '../../../infrastructure/adapter/http/header';
import { ResponseFactory } from '../../../infrastructure/adapter/http/response-factory';
import { CustomError } from '../../../infrastructure/adapter/http/error-handler';
import { ICreateDoctor, IUpdateDoctor } from '../../../domain/dto/doctor/doctor-dto';

export class DoctorController {
    private readonly router: Router = Router();

    constructor(private readonly doctorService: DoctorService) {
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/doctors', this.create.bind(this));
        this.router.get('/doctors', this.findAll.bind(this));
        this.router.get('/doctors/specialty/:specialtyId', this.findBySpecialty.bind(this)); // Debe ir antes de :id
        this.router.get('/doctors/:id', this.findById.bind(this));
        this.router.put('/doctors/:id', this.update.bind(this));
        this.router.delete('/doctors/:id', this.delete.bind(this));
    }

    private async create(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body as ICreateDoctor;
            const doctor = await this.doctorService.create(body);
            const response = ResponseFactory.success(doctor, 'Doctor created successfully');
            res.status(201).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(400, err.message));
        }
    }

    private async findAll(_req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const doctors = await this.doctorService.findAll();
            // Convertir Doctor entities a objetos planos
            const doctorsData = doctors.map(d => ({
                id: d.id,
                name: d.name,
                email: d.email,
                phone: d.phone,
                specialtyId: d.specialtyId,
                specialty: d.specialty,
                licenseNumber: d.licenseNumber,
                workSchedule: d.workSchedule,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
            }));
            const response = ResponseFactory.success(doctorsData);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(500, err.message));
        }
    }

    private async findById(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const doctor = await this.doctorService.findById(id);
            const response = ResponseFactory.success(doctor);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(404, err.message));
        }
    }

    private async findBySpecialty(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { specialtyId } = req.params;
            const doctors = await this.doctorService.findBySpecialty(specialtyId);
            // Convertir Doctor entities a objetos planos
            const doctorsData = doctors.map(d => ({
                id: d.id,
                name: d.name,
                email: d.email,
                phone: d.phone,
                specialtyId: d.specialtyId,
                specialty: d.specialty,
                licenseNumber: d.licenseNumber,
                workSchedule: d.workSchedule,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
            }));
            const response = ResponseFactory.success(doctorsData);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(500, err.message));
        }
    }

    private async update(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const body = req.body as IUpdateDoctor;
            const doctor = await this.doctorService.update(id, body);
            const response = ResponseFactory.success(doctor, 'Doctor updated successfully');
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(400, err.message));
        }
    }

    private async delete(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.doctorService.delete(id);
            const response = ResponseFactory.success({}, 'Doctor deleted successfully');
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
