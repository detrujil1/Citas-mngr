import { Appointment, AppointmentStatus } from '../../../src/domain/entity/appointment';

describe('Appointment entity', () => {
    it('canBeModified debe ser true si status es SCHEDULED', () => {
        const appt = new Appointment({
            id: '1',
            doctorId: 'd1',
            patientId: 'p1',
            appointmentDate: new Date(),
            startTime: '10:00',
            endTime: '10:30',
            specialtyId: 's1',
            status: AppointmentStatus.PENDING,
            reason: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        expect(appt.canBeModified()).toBe(true);
    });
    it('canBeModified debe ser false si status es CANCELLED', () => {
        const appt = new Appointment({
            id: '1',
            doctorId: 'd1',
            patientId: 'p1',
            appointmentDate: new Date(),
            startTime: '10:00',
            endTime: '10:30',
            specialtyId: 's1',
            status: AppointmentStatus.CANCELLED,
            reason: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        expect(appt.canBeModified()).toBe(false);
    });
    it('canBeCancelled debe ser true si status es SCHEDULED', () => {
        const appt = new Appointment({
            id: '1',
            doctorId: 'd1',
            patientId: 'p1',
            appointmentDate: new Date(),
            startTime: '10:00',
            endTime: '10:30',
            specialtyId: 's1',
            status: AppointmentStatus.PENDING,
            reason: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        expect(appt.canBeCancelled()).toBe(true);
    });
    it('canBeCancelled debe ser false si status es COMPLETED', () => {
        const appt = new Appointment({
            id: '1',
            doctorId: 'd1',
            patientId: 'p1',
            appointmentDate: new Date(),
            startTime: '10:00',
            endTime: '10:30',
            specialtyId: 's1',
            status: AppointmentStatus.COMPLETED,
            reason: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        expect(appt.canBeCancelled()).toBe(false);
    });
});
