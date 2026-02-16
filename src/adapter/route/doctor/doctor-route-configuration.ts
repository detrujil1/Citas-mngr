import { Router } from 'express';
import { DoctorController } from '../../controller/doctor/doctor-controller';
import { DoctorService } from '../../../usecase/doctor/doctor-service';
import { MongoDoctorRepository } from '../../../infrastructure/persistence/mongodb/repositories/doctor-repository';
import { MongoSpecialtyRepository } from '../../../infrastructure/persistence/mongodb/repositories/specialty-repository';
import { validateRequestHeaders } from '../../middleware/validate-param';
import { authenticate, requireRole } from '../../middleware/auth-middleware';
import { UserRole } from '../../../domain/entity/user';

const doctorRouter = Router();

const doctorService = new DoctorService(
    new MongoDoctorRepository(),
    new MongoSpecialtyRepository()
);
const doctorController = new DoctorController(doctorService);

// Rutas públicas (consulta)
doctorRouter.get('/doctors', [validateRequestHeaders], doctorController.getRouter());
doctorRouter.get('/doctors/:id', [validateRequestHeaders], doctorController.getRouter());
doctorRouter.get('/doctors/specialty/:specialtyId', [validateRequestHeaders], doctorController.getRouter());

// Rutas protegidas
doctorRouter.post(
    '/doctors',
    [validateRequestHeaders, authenticate, requireRole(UserRole.ADMIN, UserRole.MEDICO)],
    doctorController.getRouter()
);

doctorRouter.put(
    '/doctors/:id',
    [validateRequestHeaders, authenticate, requireRole(UserRole.ADMIN, UserRole.MEDICO)],
    doctorController.getRouter()
);

doctorRouter.delete(
    '/doctors/:id',
    [validateRequestHeaders, authenticate, requireRole(UserRole.ADMIN)],
    doctorController.getRouter()
);

export default doctorRouter;
