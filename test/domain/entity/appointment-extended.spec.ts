import { Appointment, AppointmentStatus, IAppointment } from '../../../src/domain/entity/appointment';

describe('Appointment entity - extended coverage', () => {
    const baseData: IAppointment = {
        id: 'a1',
        patientId: 'p1',
        doctorId: 'd1',
        specialtyId: 's1',
        appointmentDate: new Date('2023-01-01T10:00:00Z'),
        startTime: '10:00',
        endTime: '10:30',
        status: AppointmentStatus.PENDING,
        reason: 'Consulta',
        createdAt: new Date('2023-01-01T09:00:00Z'),
        updatedAt: new Date('2023-01-01T09:30:00Z'),
    };

    it('should expose all getters correctly', () => {
        const appt = new Appointment({ ...baseData, notes: 'Traer estudios' });
        expect(appt.id).toBe(baseData.id);
        expect(appt.patientId).toBe(baseData.patientId);
        expect(appt.doctorId).toBe(baseData.doctorId);
        expect(appt.specialtyId).toBe(baseData.specialtyId);
        expect(appt.appointmentDate).toEqual(baseData.appointmentDate);
        expect(appt.startTime).toBe(baseData.startTime);
        expect(appt.endTime).toBe(baseData.endTime);
        expect(appt.status).toBe(baseData.status);
        expect(appt.reason).toBe(baseData.reason);
        expect(appt.notes).toBe('Traer estudios');
        expect(appt.createdAt).toEqual(baseData.createdAt);
        expect(appt.updatedAt).toEqual(baseData.updatedAt);
    });

    it('should return undefined for notes if not set', () => {
        const appt = new Appointment(baseData);
        expect(appt.notes).toBeUndefined();
    });

    describe('isActive', () => {
        it('should be true for PENDING', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.PENDING });
            expect(appt.isActive()).toBe(true);
        });
        it('should be true for CONFIRMED', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.CONFIRMED });
            expect(appt.isActive()).toBe(true);
        });
        it('should be false for COMPLETED', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.COMPLETED });
            expect(appt.isActive()).toBe(false);
        });
        it('should be false for CANCELLED', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.CANCELLED });
            expect(appt.isActive()).toBe(false);
        });
        it('should be false for NO_SHOW', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.NO_SHOW });
            expect(appt.isActive()).toBe(false);
        });
    });

    describe('canBeModified', () => {
        it('should be true for PENDING', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.PENDING });
            expect(appt.canBeModified()).toBe(true);
        });
        it('should be true for CONFIRMED', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.CONFIRMED });
            expect(appt.canBeModified()).toBe(true);
        });
        it('should be false for COMPLETED', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.COMPLETED });
            expect(appt.canBeModified()).toBe(false);
        });
        it('should be false for CANCELLED', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.CANCELLED });
            expect(appt.canBeModified()).toBe(false);
        });
        it('should be false for NO_SHOW', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.NO_SHOW });
            expect(appt.canBeModified()).toBe(false);
        });
    });

    describe('canBeCancelled', () => {
        it('should be true for PENDING', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.PENDING });
            expect(appt.canBeCancelled()).toBe(true);
        });
        it('should be true for CONFIRMED', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.CONFIRMED });
            expect(appt.canBeCancelled()).toBe(true);
        });
        it('should be false for COMPLETED', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.COMPLETED });
            expect(appt.canBeCancelled()).toBe(false);
        });
        it('should be false for CANCELLED', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.CANCELLED });
            expect(appt.canBeCancelled()).toBe(false);
        });
        it('should be false for NO_SHOW', () => {
            const appt = new Appointment({ ...baseData, status: AppointmentStatus.NO_SHOW });
            expect(appt.canBeCancelled()).toBe(false);
        });
    });

    it('should serialize to JSON correctly', () => {
        const appt = new Appointment({ ...baseData, notes: 'Traer estudios' });
        expect(appt.toJSON()).toEqual({ ...baseData, notes: 'Traer estudios' });
    });
});
