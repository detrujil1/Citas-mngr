import { DoctorService } from '../../../src/usecase/doctor/doctor-service';

describe('DoctorService - extended coverage', () => {
    let service: DoctorService;
    let mockDoctorRepo: any;
    let mockSpecialtyRepo: any;

    beforeEach(() => {
        mockDoctorRepo = {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findBySpecialty: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        mockSpecialtyRepo = {
            findById: jest.fn(),
        };
        service = new DoctorService(mockDoctorRepo, mockSpecialtyRepo);
    });

    it('should create a doctor when specialty exists and email is not registered', async () => {
        const mockSpecialty = { id: 's1', name: 'Cardiology' };
        const mockDoctor = { id: 'd1', name: 'Dr. House', email: 'house@hospital.com', specialtyId: 's1' };
        mockSpecialtyRepo.findById.mockResolvedValue(mockSpecialty);
        mockDoctorRepo.findByEmail.mockResolvedValue(null);
        mockDoctorRepo.create.mockResolvedValue(mockDoctor);
        await expect(service.create({ name: 'Dr. House', email: 'house@hospital.com', specialtyId: 's1' } as any)).resolves.toEqual(mockDoctor);
    });

    it('should throw error if specialty not found', async () => {
        mockSpecialtyRepo.findById.mockResolvedValue(null);
        await expect(service.create({ name: 'Dr. House', email: 'house@hospital.com', specialtyId: 's1' } as any)).rejects.toThrow('Specialty not found');
    });

    it('should throw error if email already registered', async () => {
        const mockSpecialty = { id: 's1' };
        const mockDoctor = { id: 'd1', email: 'house@hospital.com' };
        mockSpecialtyRepo.findById.mockResolvedValue(mockSpecialty);
        mockDoctorRepo.findByEmail.mockResolvedValue(mockDoctor);
        await expect(service.create({ name: 'Dr. House', email: 'house@hospital.com', specialtyId: 's1' } as any)).rejects.toThrow('Email already registered');
    });

    it('should find doctor by id', async () => {
        const mockDoctor = { id: 'd1', name: 'Dr. House' };
        mockDoctorRepo.findById.mockResolvedValue(mockDoctor);
        await expect(service.findById('d1')).resolves.toEqual(mockDoctor);
    });

    it('should throw error if doctor not found by id', async () => {
        mockDoctorRepo.findById.mockResolvedValue(null);
        await expect(service.findById('x')).rejects.toThrow('Doctor not found');
    });

    it('should find doctors by specialty', async () => {
        const mockDoctors = [{ id: 'd1' }];
        mockDoctorRepo.findBySpecialty.mockResolvedValue(mockDoctors);
        await expect(service.findBySpecialty('s1')).resolves.toEqual(mockDoctors);
    });

    it('should find all doctors', async () => {
        const mockDoctors = [{ id: 'd1' }, { id: 'd2' }];
        mockDoctorRepo.findAll.mockResolvedValue(mockDoctors);
        await expect(service.findAll()).resolves.toEqual(mockDoctors);
    });

    it('should update a doctor', async () => {
        const mockDoctor = { id: 'd1', name: 'Dr. House' };
        const mockUpdated = { id: 'd1', name: 'Dr. Updated' };
        mockDoctorRepo.findById.mockResolvedValue(mockDoctor);
        mockDoctorRepo.update.mockResolvedValue(mockUpdated);
        await expect(service.update('d1', { name: 'Dr. Updated' } as any)).resolves.toEqual(mockUpdated);
    });

    it('should throw error if doctor not found on update', async () => {
        mockDoctorRepo.findById.mockResolvedValue(null);
        await expect(service.update('x', { name: 'Dr. Updated' } as any)).rejects.toThrow('Doctor not found');
    });

    it('should update doctor with new specialty', async () => {
        const mockDoctor = { id: 'd1', name: 'Dr. House' };
        const mockSpecialty = { id: 's2', name: 'Neurology' };
        const mockUpdated = { id: 'd1', name: 'Dr. House', specialtyId: 's2' };
        mockDoctorRepo.findById.mockResolvedValue(mockDoctor);
        mockSpecialtyRepo.findById.mockResolvedValue(mockSpecialty);
        mockDoctorRepo.update.mockResolvedValue(mockUpdated);
        await expect(service.update('d1', { specialtyId: 's2' } as any)).resolves.toEqual(mockUpdated);
    });

    it('should throw error if new specialty not found on update', async () => {
        const mockDoctor = { id: 'd1', name: 'Dr. House' };
        mockDoctorRepo.findById.mockResolvedValue(mockDoctor);
        mockSpecialtyRepo.findById.mockResolvedValue(null);
        await expect(service.update('d1', { specialtyId: 's2' } as any)).rejects.toThrow('Specialty not found');
    });

    it('should throw error if update fails', async () => {
        const mockDoctor = { id: 'd1', name: 'Dr. House' };
        mockDoctorRepo.findById.mockResolvedValue(mockDoctor);
        mockDoctorRepo.update.mockResolvedValue(null);
        await expect(service.update('d1', { name: 'Dr. Updated' } as any)).rejects.toThrow('Failed to update doctor');
    });

    it('should delete a doctor', async () => {
        mockDoctorRepo.delete.mockResolvedValue(true);
        await expect(service.delete('d1')).resolves.toBeUndefined();
    });

    it('should throw error if delete fails', async () => {
        mockDoctorRepo.delete.mockResolvedValue(false);
        await expect(service.delete('x')).rejects.toThrow('Doctor not found or could not be deleted');
    });
});
