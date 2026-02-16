import { MongoDoctorRepository } from '../../../../../src/infrastructure/persistence/mongodb/repositories/doctor-repository';
import { DoctorModel } from '../../../../../src/infrastructure/persistence/mongodb/schemas/doctor-schema';
jest.mock('../../../../../src/infrastructure/persistence/mongodb/schemas/specialty-schema', () => ({
    SpecialtyModel: { findById: jest.fn().mockResolvedValue({ _id: 's1', name: 'Cardiology', description: 'desc', createdAt: new Date(), updatedAt: new Date() }) }
}));

describe('MongoDoctorRepository', () => {
    let repo: MongoDoctorRepository;

    beforeEach(() => {
        repo = new MongoDoctorRepository();
    });

    it('debería buscar doctor por email', async () => {
        jest.spyOn(DoctorModel, 'findOne').mockResolvedValue({ _id: '1', name: 'doc', email: 'a@a.com', password: '123', specialtyId: 's1', licenseNumber: '123', createdAt: new Date(), updatedAt: new Date() } as any);
        const doctor = await repo.findByEmail('a@a.com');
        expect(doctor).toBeDefined();
        expect(doctor?.email).toBe('a@a.com');
    });

    // ...otros tests para findById, create, update, delete
});
