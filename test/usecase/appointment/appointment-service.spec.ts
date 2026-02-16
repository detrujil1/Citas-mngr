import { AppointmentService } from '../../../src/usecase/appointment/appointment-service';
import { IAppointmentRepository } from '../../../src/domain/port/appointment/appointment-repository';
import { IDoctorRepository } from '../../../src/domain/port/doctor/doctor-repository';
// import { Appointment, AppointmentStatus } from '../../../src/domain/entity/appointment';

describe('AppointmentService', () => {
    let service: AppointmentService;
    let mockAppointmentRepo: jest.Mocked<IAppointmentRepository>;
    let mockDoctorRepo: jest.Mocked<IDoctorRepository>;
    let mockDoctor: any;

    beforeEach(() => {
        mockAppointmentRepo = {
            create: jest.fn(),
            findById: jest.fn(),
            findByFilter: jest.fn(),
            hasConflict: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        mockDoctorRepo = {
            findById: jest.fn(),
        } as any;
        service = new AppointmentService(mockAppointmentRepo, mockDoctorRepo);
        mockDoctor = {
            id: 'doc1',
            specialtyId: 'spec1',
            isAvailableAt: jest.fn(),
        };
    });

    it('debería crear cita si todo es válido', async () => {
        mockDoctorRepo.findById.mockResolvedValue(mockDoctor);
        mockDoctor.isAvailableAt.mockReturnValue(true);
        mockAppointmentRepo.hasConflict.mockResolvedValue(false);
            // Mock de Appointment realista
            const mockAppointment = {
                id: 'appt1',
                doctorId: 'doc1',
                patientId: 'pat1',
                appointmentDate: new Date(),
                startTime: '10:00',
                endTime: '10:30',
                specialtyId: 'spec1',
                status: 'SCHEDULED',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockAppointmentRepo.create.mockResolvedValue(mockAppointment as any);
        const data = { doctorId: 'doc1', patientId: 'pat1', appointmentDate: new Date(Date.now() + 10000).toISOString(), startTime: '10:00' };
        await expect(service.create(data as any)).resolves.toBeDefined();
    });

    it('debería fallar si el doctor no existe', async () => {
        mockDoctorRepo.findById.mockResolvedValue(null);
        const data = { doctorId: 'doc1', patientId: 'pat1', appointmentDate: new Date(Date.now() + 10000).toISOString(), startTime: '10:00' };
        await expect(service.create(data as any)).rejects.toThrow('Doctor not found');
    });

    it('debería fallar si la fecha es pasada', async () => {
        mockDoctorRepo.findById.mockResolvedValue(mockDoctor);
        const data = { doctorId: 'doc1', patientId: 'pat1', appointmentDate: new Date(Date.now() - 10000).toISOString(), startTime: '10:00' };
        await expect(service.create(data as any)).rejects.toThrow('Appointment date cannot be in the past');
    });

    it('debería fallar si el doctor no está disponible', async () => {
        mockDoctorRepo.findById.mockResolvedValue(mockDoctor);
        mockDoctor.isAvailableAt.mockReturnValue(false);
        const data = { doctorId: 'doc1', patientId: 'pat1', appointmentDate: new Date(Date.now() + 10000).toISOString(), startTime: '10:00' };
        await expect(service.create(data as any)).rejects.toThrow('Doctor is not available at this time');
    });

    it('debería fallar si hay conflicto de horario', async () => {
        mockDoctorRepo.findById.mockResolvedValue(mockDoctor);
        mockDoctor.isAvailableAt.mockReturnValue(true);
        mockAppointmentRepo.hasConflict.mockResolvedValue(true);
        const data = { doctorId: 'doc1', patientId: 'pat1', appointmentDate: new Date(Date.now() + 10000).toISOString(), startTime: '10:00' };
        await expect(service.create(data as any)).rejects.toThrow('This time slot is already booked');
    });

    // ...otros tests para update, cancel, delete, getAvailableSlots
});
