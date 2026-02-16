import { Router } from 'express';
import { AuthenticationController } from '../../controller/user/authentication/auth-controller';
import { JWTAuthenticatorAdapter } from '../../../infrastructure/adapter/jwt/authentication';
import { AuthService } from '../../../usecase/auth/auth-service';
import { MongoAuthCreator } from '../../../infrastructure/persistence/mongodb/repositories/auth-creator';
import { MongoDoctorRepository } from '../../../infrastructure/persistence/mongodb/repositories/doctor-repository';
import { MongoPatientRepository } from '../../../infrastructure/persistence/mongodb/repositories/patient-repository';
import { validateRequestBody } from '../../middleware/validate-param';

const userRouter = Router();

// Auth Service with all dependencies
const authService = new AuthService(
    new MongoAuthCreator(),
    new JWTAuthenticatorAdapter(),
    new MongoDoctorRepository(),
    new MongoPatientRepository()
);

const authController = new AuthenticationController(authService);

// Apply middleware and mount routes
userRouter.use(
    validateRequestBody,
    authController.getRouter()
);

export default userRouter;
