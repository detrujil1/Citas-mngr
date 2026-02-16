import { Doctor } from '../../../src/domain/entity/doctor';

describe('Doctor entity', () => {
    it('debería exponer los getters correctamente', () => {
        const data = {
            id: 'd1',
            name: 'Dr. House',
            email: 'house@hospital.com',
            password: 'hash',
            phone: '123',
            specialtyId: 's1',
            licenseNumber: 'LN123',
            workSchedule: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const doctor = new Doctor(data);
        expect(doctor.id).toBe(data.id);
        expect(doctor.name).toBe(data.name);
        expect(doctor.email).toBe(data.email);
        expect(doctor.licenseNumber).toBe(data.licenseNumber);
    });
});
