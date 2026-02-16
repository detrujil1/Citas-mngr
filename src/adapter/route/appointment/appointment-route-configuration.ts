import { Router } from 'express';
import { AppointmentController } from '../../controller/appointment/appointment-controller';
import { AppointmentService } from '../../../usecase/appointment/appointment-service';
import { MongoAppointmentRepository } from '../../../infrastructure/persistence/mongodb/repositories/appointment-repository';
import { MongoDoctorRepository } from '../../../infrastructure/persistence/mongodb/repositories/doctor-repository';
import { validateRequestHeaders } from '../../middleware/validate-param';
import { authenticate, requireRole } from '../../middleware/auth-middleware';
import { UserRole } from '../../../domain/entity/user';

const appointmentRouter = Router();

const appointmentService = new AppointmentService(
    new MongoAppointmentRepository(),
    new MongoDoctorRepository()
);
const appointmentController = new AppointmentController(appointmentService);

// Todas las rutas de citas requieren autenticación
appointmentRouter.post(
    '/appointments',
    [validateRequestHeaders, authenticate, requireRole(UserRole.PACIENTE, UserRole.ADMIN)],
    appointmentController.getRouter()
);

appointmentRouter.get(
    '/appointments',
    [validateRequestHeaders, authenticate],
    appointmentController.getRouter()
);

appointmentRouter.get(
    '/appointments/available-slots/:doctorId',
    [validateRequestHeaders, authenticate, requireRole(UserRole.PACIENTE, UserRole.MEDICO, UserRole.ADMIN)],
    appointmentController.getRouter()
);

appointmentRouter.get(
    '/appointments/:id',
    [validateRequestHeaders, authenticate],
    appointmentController.getRouter()
);

appointmentRouter.put(
    '/appointments/:id',
    [validateRequestHeaders, authenticate, requireRole(UserRole.PACIENTE, UserRole.MEDICO, UserRole.ADMIN)],
    appointmentController.getRouter()
);

appointmentRouter.patch(
    '/appointments/:id/cancel',
    [validateRequestHeaders, authenticate, requireRole(UserRole.PACIENTE, UserRole.MEDICO, UserRole.ADMIN)],
    appointmentController.getRouter()
);

appointmentRouter.delete(
    '/appointments/:id',
    [validateRequestHeaders, authenticate, requireRole(UserRole.ADMIN)],
    appointmentController.getRouter()
);

export default appointmentRouter;
