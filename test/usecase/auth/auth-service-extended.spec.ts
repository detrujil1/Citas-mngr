import { AuthService } from '../../../src/usecase/auth/auth-service';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn((pwd) => Promise.resolve(`hashed_${pwd}`)),
}));

describe('AuthService - extended coverage', () => {
    let service: AuthService;
    let mockAuthCreator: any;
    let mockJWT: any;
    let mockDoctorRepo: any;
    let mockPatientRepo: any;

    beforeEach(() => {
        mockAuthCreator = { createDoctor: jest.fn(), createPatient: jest.fn() };
        mockJWT = { generateToken: jest.fn(), verifyToken: jest.fn(), comparePasswords: jest.fn() };
        mockDoctorRepo = { findByEmail: jest.fn() };
        mockPatientRepo = { findByEmail: jest.fn() };
        service = new AuthService(mockAuthCreator, mockJWT, mockDoctorRepo, mockPatientRepo);
    });

    it('should register patient when email does not exist', async () => {
        mockPatientRepo.findByEmail.mockResolvedValue(null);
        mockAuthCreator.createPatient.mockResolvedValue({
            id: 'p1',
            email: 'patient@test.com',
            name: 'John',
            phone: '123',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        mockJWT.generateToken.mockResolvedValue('patient_token');
        const data = { email: 'patient@test.com', password: 'pass123', name: 'John', phone: '123' };
        const res = await service.registerPatient(data as any);
        expect(res.token).toBe('patient_token');
        expect(res.user.id).toBe('p1');
    });

    it('should throw error if patient email already exists', async () => {
        mockPatientRepo.findByEmail.mockResolvedValue({ id: 'p1', email: 'patient@test.com' });
        const data = { email: 'patient@test.com', password: 'pass123', name: 'John', phone: '123' };
        await expect(service.registerPatient(data as any)).rejects.toThrow('Email already registered');
    });

    it('should hash password when registering doctor', async () => {
        mockDoctorRepo.findByEmail.mockResolvedValue(null);
        mockAuthCreator.createDoctor.mockResolvedValue({
            id: 'd1',
            email: 'doctor@test.com',
            name: 'Dr. Smith',
            specialtyId: 's1',
            licenseNumber: 'L123',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        mockJWT.generateToken.mockResolvedValue('doctor_token');
        const data = { email: 'doctor@test.com', password: 'pass123', name: 'Dr. Smith', specialtyId: 's1', licenseNumber: 'L123' };
        await service.registerDoctor(data as any);
        expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
    });

    it('should hash password when registering patient', async () => {
        mockPatientRepo.findByEmail.mockResolvedValue(null);
        mockAuthCreator.createPatient.mockResolvedValue({
            id: 'p1',
            email: 'patient@test.com',
            name: 'John',
            phone: '123',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        mockJWT.generateToken.mockResolvedValue('patient_token');
        const data = { email: 'patient@test.com', password: 'pass123', name: 'John', phone: '123' };
        await service.registerPatient(data as any);
        expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
    });
});
