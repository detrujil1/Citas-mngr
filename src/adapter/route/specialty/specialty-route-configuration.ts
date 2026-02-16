import { Router } from 'express';
import { SpecialtyController } from '../../controller/specialty/specialty-controller';
import { SpecialtyService } from '../../../usecase/specialty/specialty-service';
import { MongoSpecialtyRepository } from '../../../infrastructure/persistence/mongodb/repositories/specialty-repository';
import { validateRequestHeaders } from '../../middleware/validate-param';
import { authenticate, requireRole } from '../../middleware/auth-middleware';
import { UserRole } from '../../../domain/entity/user';

const specialtyRouter = Router();

const specialtyService = new SpecialtyService(new MongoSpecialtyRepository());
const specialtyController = new SpecialtyController(specialtyService);

// Rutas públicas (solo lectura)
specialtyRouter.get('/specialties', [validateRequestHeaders], specialtyController.getRouter());
specialtyRouter.get('/specialties/:id', [validateRequestHeaders], specialtyController.getRouter());

// Rutas protegidas (solo ADMIN)
specialtyRouter.post(
    '/specialties',
    [validateRequestHeaders, authenticate, requireRole(UserRole.ADMIN)],
    specialtyController.getRouter()
);

specialtyRouter.put(
    '/specialties/:id',
    [validateRequestHeaders, authenticate, requireRole(UserRole.ADMIN)],
    specialtyController.getRouter()
);

specialtyRouter.delete(
    '/specialties/:id',
    [validateRequestHeaders, authenticate, requireRole(UserRole.ADMIN)],
    specialtyController.getRouter()
);

export default specialtyRouter;
