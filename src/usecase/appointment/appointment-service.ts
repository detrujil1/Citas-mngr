import { IAppointmentRepository } from '../../domain/port/appointment/appointment-repository';
import { IDoctorRepository } from '../../domain/port/doctor/doctor-repository';
import { ICreateAppointment, IUpdateAppointment, IAppointmentFilter, IAvailableSlot } from '../../domain/dto/appointment/appointment-dto';
import { Appointment, AppointmentStatus } from '../../domain/entity/appointment';

export class AppointmentService {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly doctorRepository: IDoctorRepository
    ) {}

    async create(data: ICreateAppointment): Promise<Appointment> {
        // Validar que el doctor exista
        const doctor = await this.doctorRepository.findById(data.doctorId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        if (!data.patientId) {
            throw new Error('Patient not authenticated');
        }

        // Validar la fecha de la cita
        const appointmentDate = new Date(data.appointmentDate);
        const now = new Date();
        
        if (appointmentDate < now) {
            throw new Error('Appointment date cannot be in the past');
        }

        // Validar que el doctor esté disponible en ese horario
        const dayOfWeek = appointmentDate.getDay();
        const isAvailable = doctor.isAvailableAt(dayOfWeek, data.startTime);
        
        if (!isAvailable) {
            throw new Error('Doctor is not available at this time');
        }

        // Calcular endTime (30 minutos después de startTime)
        const [hours, minutes] = data.startTime.split(':').map(Number);
        const endHours = minutes + 30 >= 60 ? hours + 1 : hours;
        const endMinutes = (minutes + 30) % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

        // Validar que no haya conflicto con otras citas
        const hasConflict = await this.appointmentRepository.hasConflict(
            data.doctorId,
            appointmentDate,
            data.startTime,
            endTime
        );

        if (hasConflict) {
            throw new Error('This time slot is already booked');
        }

        return await this.appointmentRepository.create({
            ...data,
            endTime,
            specialtyId: doctor.specialtyId,
        });
    }

    async findById(id: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment;
    }

    async findByFilter(filter: IAppointmentFilter): Promise<Appointment[]> {
        return await this.appointmentRepository.findByFilter(filter);
    }

    async getAvailableSlots(doctorId: string, date: string): Promise<IAvailableSlot[]> {
        const doctor = await this.doctorRepository.findById(doctorId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            throw new Error('Invalid date');
        }

        const dayOfWeek = appointmentDate.getDay();
        const schedules = doctor.workSchedule?.filter(
            schedule => schedule.isActive && schedule.dayOfWeek === dayOfWeek
        ) || [];

        if (schedules.length === 0) {
            return [];
        }

        const startDate = new Date(appointmentDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(appointmentDate);
        endDate.setHours(23, 59, 59, 999);

        const appointments = await this.appointmentRepository.findByFilter({
            doctorId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });

        const bookedRanges = appointments.map(appointment => ({
            start: this.timeToMinutes(appointment.startTime),
            end: this.timeToMinutes(appointment.endTime),
        }));

        const slots: IAvailableSlot[] = [];

        schedules.forEach(schedule => {
            let current = this.timeToMinutes(schedule.startTime);
            const end = this.timeToMinutes(schedule.endTime);

            while (current + 30 <= end) {
                const slotStart = current;
                const slotEnd = current + 30;
                const hasConflict = bookedRanges.some(range => slotStart < range.end && slotEnd > range.start);

                slots.push({
                    date: appointmentDate.toISOString().split('T')[0],
                    startTime: this.minutesToTime(slotStart),
                    endTime: this.minutesToTime(slotEnd),
                    isAvailable: !hasConflict,
                });

                current += 30;
            }
        });

        return slots;
    }

    async update(id: string, data: IUpdateAppointment): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        // Validar que la cita pueda ser modificada
        if (!appointment.canBeModified() && data.appointmentDate) {
            throw new Error('This appointment cannot be modified');
        }

        // Si se actualiza la fecha/hora, validar disponibilidad y conflictos
        if (data.appointmentDate || data.startTime || data.endTime) {
            const newDate = data.appointmentDate 
                ? new Date(data.appointmentDate) 
                : appointment.appointmentDate;
            const newStartTime = data.startTime || appointment.startTime;
            const newEndTime = data.endTime || appointment.endTime;

            // Validar disponibilidad del doctor
            const doctor = await this.doctorRepository.findById(appointment.doctorId);
            if (doctor) {
                const dayOfWeek = newDate.getDay();
                const isAvailable = doctor.isAvailableAt(dayOfWeek, newStartTime);
                
                if (!isAvailable) {
                    throw new Error('Doctor is not available at this time');
                }
            }

            // Validar conflictos
            const hasConflict = await this.appointmentRepository.hasConflict(
                appointment.doctorId,
                newDate,
                newStartTime,
                newEndTime,
                id
            );

            if (hasConflict) {
                throw new Error('This time slot is already booked');
            }
        }

        const updated = await this.appointmentRepository.update(id, data);
        if (!updated) {
            throw new Error('Failed to update appointment');
        }
        return updated;
    }

    async cancel(id: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        if (!appointment.canBeCancelled()) {
            throw new Error('This appointment cannot be cancelled');
        }

        const updated = await this.appointmentRepository.update(id, {
            status: AppointmentStatus.CANCELLED
        });

        if (!updated) {
            throw new Error('Failed to cancel appointment');
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.appointmentRepository.delete(id);
        if (!deleted) {
            throw new Error('Appointment not found or could not be deleted');
        }
    }

    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    private minutesToTime(totalMinutes: number): string {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
}
