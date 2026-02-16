import { NextFunction, Response, Router } from 'express';
import { AppointmentService } from '../../../usecase/appointment/appointment-service';
import { IRequest } from '../../../infrastructure/adapter/http/header';
import { ResponseFactory } from '../../../infrastructure/adapter/http/response-factory';
import { CustomError } from '../../../infrastructure/adapter/http/error-handler';
import { ICreateAppointment, IUpdateAppointment, IAppointmentFilter } from '../../../domain/dto/appointment/appointment-dto';

export class AppointmentController {
    private readonly router: Router = Router();

    constructor(private readonly appointmentService: AppointmentService) {
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/appointments', this.create.bind(this));
        this.router.get('/appointments/available-slots/:doctorId', this.getAvailableSlots.bind(this));
        this.router.get('/appointments/my-appointments', this.getMyAppointments.bind(this)); // Antes de :id
        this.router.get('/appointments', this.findByFilter.bind(this));
        this.router.get('/appointments/:id', this.findById.bind(this));
        this.router.put('/appointments/:id', this.update.bind(this));
        this.router.patch('/appointments/:id/cancel', this.cancel.bind(this));
        this.router.delete('/appointments/:id', this.delete.bind(this));
    }

    private async create(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const body = req.body as Omit<ICreateAppointment, 'patientId'>;
            const appointment = await this.appointmentService.create({
                ...body,
                patientId: userId,
            } as ICreateAppointment);
            const response = ResponseFactory.success(appointment, 'Appointment created successfully');
            res.status(201).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(400, err.message));
        }
    }

    private async findByFilter(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = req.query as unknown as IAppointmentFilter;
            const appointments = await this.appointmentService.findByFilter(filter);
            const response = ResponseFactory.success(appointments);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(500, err.message));
        }
    }

    private async getMyAppointments(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const appointments = await this.appointmentService.findByFilter({ patientId: userId });
            const response = ResponseFactory.success(appointments);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(500, err.message));
        }
    }

    private async getAvailableSlots(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { doctorId } = req.params;
            const { date } = req.query as { date?: string };
            if (!date) {
                throw new Error('Date is required');
            }

            const slots = await this.appointmentService.getAvailableSlots(doctorId, date);
            const response = ResponseFactory.success(slots);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(400, err.message));
        }
    }

    private async findById(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const appointment = await this.appointmentService.findById(id);
            const response = ResponseFactory.success(appointment);
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(404, err.message));
        }
    }

    private async update(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const body = req.body as IUpdateAppointment;
            const appointment = await this.appointmentService.update(id, body);
            const response = ResponseFactory.success(appointment, 'Appointment updated successfully');
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(400, err.message));
        }
    }

    private async cancel(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const appointment = await this.appointmentService.cancel(id);
            const response = ResponseFactory.success(appointment, 'Appointment cancelled successfully');
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            next(new CustomError(400, err.message));
        }
    }

    private async delete(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.appointmentService.delete(id);
            const response = ResponseFactory.success({}, 'Appointment deleted successfully');
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
