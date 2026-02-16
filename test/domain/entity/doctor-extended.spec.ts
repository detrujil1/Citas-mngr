import { Doctor, IDoctor } from '../../../src/domain/entity/doctor';
import { IWorkSchedule } from '../../../src/domain/entity/work-schedule';
import { ISpecialty } from '../../../src/domain/entity/specialty';

describe('Doctor entity - extended coverage', () => {
    const baseData: IDoctor = {
        id: 'd1',
        name: 'Dr. House',
        email: 'house@hospital.com',
        password: 'hash',
        phone: '123',
        specialtyId: 's1',
        licenseNumber: 'LN123',
        workSchedule: [],
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z'),
    };

    it('should return undefined for optional specialty if not set', () => {
        const doctor = new Doctor(baseData);
        expect(doctor.specialty).toBeUndefined();
    });

    it('should return specialty if set', () => {
        const specialty: ISpecialty = {
            id: 's1',
            name: 'Cardiology',
            description: 'Heart stuff',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const doctor = new Doctor({ ...baseData, specialty });
        expect(doctor.specialty).toBe(specialty);
    });

    it('should return undefined for optional workSchedule if not set', () => {
        const doctor = new Doctor({ ...baseData, workSchedule: undefined });
        expect(doctor.workSchedule).toBeUndefined();
    });

    it('should return correct createdAt and updatedAt', () => {
        const doctor = new Doctor(baseData);
        expect(doctor.createdAt).toEqual(new Date('2023-01-01T10:00:00Z'));
        expect(doctor.updatedAt).toEqual(new Date('2023-01-02T10:00:00Z'));
    });

    describe('isAvailableAt', () => {
        const workSchedule: IWorkSchedule[] = [
            {
                id: 'ws1',
                doctorId: 'd1',
                dayOfWeek: 1,
                startTime: '09:00',
                endTime: '17:00',
                isActive: true,
            },
            {
                id: 'ws2',
                doctorId: 'd1',
                dayOfWeek: 2,
                startTime: '10:00',
                endTime: '15:00',
                isActive: false,
            },
        ];
        it('should return false if workSchedule is undefined', () => {
            const doctor = new Doctor({ ...baseData, workSchedule: undefined });
            expect(doctor.isAvailableAt(1, '10:00')).toBe(false);
        });
        it('should return true if available at given time', () => {
            const doctor = new Doctor({ ...baseData, workSchedule });
            expect(doctor.isAvailableAt(1, '10:00')).toBe(true);
        });
        it('should return false if not available at given time', () => {
            const doctor = new Doctor({ ...baseData, workSchedule });
            expect(doctor.isAvailableAt(1, '08:00')).toBe(false);
        });
        it('should return false if schedule is not active', () => {
            const doctor = new Doctor({ ...baseData, workSchedule });
            expect(doctor.isAvailableAt(2, '11:00')).toBe(false);
        });
    });
});
