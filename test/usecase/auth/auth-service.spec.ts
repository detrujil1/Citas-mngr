import { AuthService } from '../../../src/usecase/auth/auth-service';
import { MongoAuthCreator } from '../../../src/infrastructure/persistence/mongodb/repositories/auth-creator';
import { JWTAuthenticatorAdapter } from '../../../src/infrastructure/adapter/jwt/authentication';
import { MongoDoctorRepository } from '../../../src/infrastructure/persistence/mongodb/repositories/doctor-repository';
import { MongoPatientRepository } from '../../../src/infrastructure/persistence/mongodb/repositories/patient-repository';
import { Doctor } from '../../../src/domain/entity/doctor';
// import { UserRole } from '../../../src/domain/entity/user';

describe('AuthService', () => {
    let service: AuthService;
    let mockAuthCreator: jest.Mocked<MongoAuthCreator>;
    let mockJWT: jest.Mocked<JWTAuthenticatorAdapter>;
    let mockDoctorRepo: jest.Mocked<MongoDoctorRepository>;
    let mockPatientRepo: jest.Mocked<MongoPatientRepository>;

    beforeEach(() => {
        mockAuthCreator = { createDoctor: jest.fn(), createPatient: jest.fn() } as any;
        mockJWT = { generateToken: jest.fn(), verifyToken: jest.fn(), comparePasswords: jest.fn() } as any;
        mockDoctorRepo = { findByEmail: jest.fn() } as any;
        mockPatientRepo = { findByEmail: jest.fn() } as any;
        service = new AuthService(mockAuthCreator, mockJWT, mockDoctorRepo, mockPatientRepo);
    });

    it('debería registrar doctor si email no existe', async () => {
        mockDoctorRepo.findByEmail.mockResolvedValue(null);
        mockAuthCreator.createDoctor.mockResolvedValue({ id: 'd1', email: 'a@a.com', name: 'doc', specialtyId: 's1', licenseNumber: '123', createdAt: new Date(), updatedAt: new Date() });
        mockJWT.generateToken.mockResolvedValue('token');
        const data = { email: 'a@a.com', password: '123', name: 'doc', specialtyId: 's1', licenseNumber: '123' };
        const res = await service.registerDoctor(data as any);
        expect(res.token).toBe('token');
    });

    it('debería lanzar error si email ya existe doctor', async () => {
        // Mock de Doctor realista
        const doctorData = {
            id: 'd1',
            name: 'doc',
            email: 'a@a.com',
            password: '123',
            phone: '123',
            specialtyId: 's1',
            licenseNumber: '123',
            workSchedule: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const doctor = new Doctor(doctorData);
        doctor.isAvailableAt = jest.fn().mockReturnValue(true);
        mockDoctorRepo.findByEmail.mockResolvedValue(doctor);
        const data = { email: 'a@a.com', password: '123', name: 'doc', specialtyId: 's1', licenseNumber: '123' };
        await expect(service.registerDoctor(data as any)).rejects.toThrow('Email already registered');
    });

    // ...otros tests para registerPatient y login
});
