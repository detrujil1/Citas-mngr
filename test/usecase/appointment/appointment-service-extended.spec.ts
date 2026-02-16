import { AppointmentService } from '../../../src/usecase/appointment/appointment-service';
import { IAppointmentRepository } from '../../../src/domain/port/appointment/appointment-repository';
import { IDoctorRepository } from '../../../src/domain/port/doctor/doctor-repository';
import { Appointment, AppointmentStatus } from '../../../src/domain/entity/appointment';
import { Doctor } from '../../../src/domain/entity/doctor';

describe('AppointmentService - Extended Coverage', () => {
    let service: AppointmentService;
    let appointmentRepository: jest.Mocked<IAppointmentRepository>;
    let doctorRepository: jest.Mocked<IDoctorRepository>;

    beforeEach(() => {
        appointmentRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findByFilter: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            hasConflict: jest.fn(),
        } as jest.Mocked<IAppointmentRepository>;

        doctorRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findBySpecialty: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as jest.Mocked<IDoctorRepository>;

        service = new AppointmentService(appointmentRepository, doctorRepository);
    });

    describe('getAvailableSlots', () => {
        it('should return available slots for a doctor on a given date', async () => {
            const doctorId = 'doctor-123';
            const date = '2024-12-20';
            const appointmentDate = new Date(date);
            const dayOfWeek = appointmentDate.getDay();

            const mockDoctor = new Doctor({
                id: doctorId,
                name: 'Dr. Smith',
                email: 'smith@example.com',
                password: 'hashed',
                phone: '123456789',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC-123',
                workSchedule: [{
                    id: 'sch-1',
                    doctorId,
                    dayOfWeek,
                    startTime: '09:00',
                    endTime: '11:00',
                    isActive: true,
                }],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            doctorRepository.findById.mockResolvedValue(mockDoctor);
            appointmentRepository.findByFilter.mockResolvedValue([]);

            const slots = await service.getAvailableSlots(doctorId, date);

            expect(slots.length).toBe(4);
            expect(slots[0]).toEqual({
                date: '2024-12-20',
                startTime: '09:00',
                endTime: '09:30',
                isAvailable: true,
            });
        });

        it('should throw error if doctor not found', async () => {
            doctorRepository.findById.mockResolvedValue(null);

            await expect(service.getAvailableSlots('invalid-id', '2024-12-20'))
                .rejects.toThrow('Doctor not found');
        });

        it('should throw error for invalid date', async () => {
            const mockDoctor = new Doctor({
                id: 'doctor-123',
                name: 'Dr. Smith',
                email: 'smith@example.com',
                password: 'hashed',
                phone: '123456789',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC-123',
                workSchedule: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            doctorRepository.findById.mockResolvedValue(mockDoctor);

            await expect(service.getAvailableSlots('doctor-123', 'invalid-date'))
                .rejects.toThrow('Invalid date');
        });

        it('should return empty array if doctor has no schedules for that day', async () => {
            const mockDoctor = new Doctor({
                id: 'doctor-123',
                name: 'Dr. Smith',
                email: 'smith@example.com',
                password: 'hashed',
                phone: '123456789',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC-123',
                workSchedule: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            doctorRepository.findById.mockResolvedValue(mockDoctor);

            const slots = await service.getAvailableSlots('doctor-123', '2024-12-20');

            expect(slots).toEqual([]);
        });

        it('should mark slots as unavailable if booked', async () => {
            const doctorId = 'doctor-123';
            const date = '2024-12-20';
            const appointmentDate = new Date(date);
            const dayOfWeek = appointmentDate.getDay();

            const mockDoctor = new Doctor({
                id: doctorId,
                name: 'Dr. Smith',
                email: 'smith@example.com',
                password: 'hashed',
                phone: '123456789',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC-123',
                workSchedule: [{
                    id: 'sch-1',
                    doctorId,
                    dayOfWeek,
                    startTime: '09:00',
                    endTime: '10:00',
                    isActive: true,
                }],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const mockAppointment = new Appointment({
                id: 'appt-1',
                patientId: 'patient-1',
                doctorId,
                specialtyId: 'spec-1',
                appointmentDate,
                startTime: '09:00',
                endTime: '09:30',
                status: AppointmentStatus.PENDING,
                reason: 'Checkup',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            doctorRepository.findById.mockResolvedValue(mockDoctor);
            appointmentRepository.findByFilter.mockResolvedValue([mockAppointment]);

            const slots = await service.getAvailableSlots(doctorId, date);

            expect(slots[0].isAvailable).toBe(false);
            expect(slots[1].isAvailable).toBe(true);
        });
    });

    describe('update', () => {
        it('should update appointment successfully', async () => {
            const appointmentId = 'appt-123';
            const mockAppointment = new Appointment({
                id: appointmentId,
                patientId: 'patient-1',
                doctorId: 'doctor-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date('2025-12-20'),
                startTime: '10:00',
                endTime: '10:30',
                status: AppointmentStatus.PENDING,
                reason: 'Old reason',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const updatedAppointment = new Appointment({
                id: appointmentId,
                patientId: 'patient-1',
                doctorId: 'doctor-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date('2025-12-20'),
                startTime: '10:00',
                endTime: '10:30',
                status: AppointmentStatus.PENDING,
                reason: 'New reason',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            appointmentRepository.findById.mockResolvedValue(mockAppointment);
            appointmentRepository.update.mockResolvedValue(updatedAppointment);

            const result = await service.update(appointmentId, { reason: 'New reason' });

            expect(result.reason).toBe('New reason');
        });

        it('should throw error if appointment not found', async () => {
            appointmentRepository.findById.mockResolvedValue(null);

            await expect(service.update('invalid-id', { reason: 'New' }))
                .rejects.toThrow('Appointment not found');
        });

        it('should throw error if trying to modify unmodifiable appointment', async () => {
            const mockAppointment = new Appointment({
                id: 'appt-123',
                patientId: 'patient-1',
                doctorId: 'doctor-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date('2020-01-01'),
                startTime: '10:00',
                endTime: '10:30',
                status: AppointmentStatus.CANCELLED,
                reason: 'Consultation',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            appointmentRepository.findById.mockResolvedValue(mockAppointment);

            await expect(service.update('appt-123', { appointmentDate: '2025-01-01' }))
                .rejects.toThrow('This appointment cannot be modified');
        });

        it('should throw error if update fails', async () => {
            const mockAppointment = new Appointment({
                id: 'appt-123',
                patientId: 'patient-1',
                doctorId: 'doctor-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date('2025-12-20'),
                startTime: '10:00',
                endTime: '10:30',
                status: AppointmentStatus.PENDING,
                reason: 'Consultation',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            appointmentRepository.findById.mockResolvedValue(mockAppointment);
            appointmentRepository.update.mockResolvedValue(null);

            await expect(service.update('appt-123', { reason: 'New' }))
                .rejects.toThrow('Failed to update appointment');
        });
    });

    describe('cancel', () => {
        it('should cancel appointment successfully', async () => {
            const mockAppointment = new Appointment({
                id: 'appt-123',
                patientId: 'patient-1',
                doctorId: 'doctor-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date('2025-12-20'),
                startTime: '10:00',
                endTime: '10:30',
                status: AppointmentStatus.PENDING,
                reason: 'Consultation',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const cancelledAppointment = new Appointment({
                id: 'appt-123',
                patientId: 'patient-1',
                doctorId: 'doctor-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date('2025-12-20'),
                startTime: '10:00',
                endTime: '10:30',
                status: AppointmentStatus.CANCELLED,
                reason: 'Consultation',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            appointmentRepository.findById.mockResolvedValue(mockAppointment);
            appointmentRepository.update.mockResolvedValue(cancelledAppointment);

            const result = await service.cancel('appt-123');

            expect(result.status).toBe(AppointmentStatus.CANCELLED);
        });

        it('should throw error if appointment not found', async () => {
            appointmentRepository.findById.mockResolvedValue(null);

            await expect(service.cancel('invalid-id'))
                .rejects.toThrow('Appointment not found');
        });

        it('should throw error if appointment cannot be cancelled', async () => {
            const mockAppointment = new Appointment({
                id: 'appt-123',
                patientId: 'patient-1',
                doctorId: 'doctor-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date('2020-01-01'),
                startTime: '10:00',
                endTime: '10:30',
                status: AppointmentStatus.COMPLETED,
                reason: 'Consultation',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            appointmentRepository.findById.mockResolvedValue(mockAppointment);

            await expect(service.cancel('appt-123'))
                .rejects.toThrow('This appointment cannot be cancelled');
        });

        it('should throw error if cancel update fails', async () => {
            const mockAppointment = new Appointment({
                id: 'appt-123',
                patientId: 'patient-1',
                doctorId: 'doctor-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date('2025-12-20'),
                startTime: '10:00',
                endTime: '10:30',
                status: AppointmentStatus.PENDING,
                reason: 'Consultation',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            appointmentRepository.findById.mockResolvedValue(mockAppointment);
            appointmentRepository.update.mockResolvedValue(null);

            await expect(service.cancel('appt-123'))
                .rejects.toThrow('Failed to cancel appointment');
        });
    });

    describe('delete', () => {
        it('should delete appointment successfully', async () => {
            appointmentRepository.delete.mockResolvedValue(true);

            await service.delete('appt-123');

            expect(appointmentRepository.delete).toHaveBeenCalledWith('appt-123');
        });

        it('should throw error if appointment not found or deletion fails', async () => {
            appointmentRepository.delete.mockResolvedValue(false);

            await expect(service.delete('invalid-id'))
                .rejects.toThrow('Appointment not found or could not be deleted');
        });
    });
});
