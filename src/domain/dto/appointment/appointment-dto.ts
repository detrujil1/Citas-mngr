import { AppointmentStatus } from "../../entity/appointment";

export interface ICreateAppointment {
    patientId: string;
    doctorId: string;
    specialtyId?: string;
    appointmentDate: string; // YYYY-MM-DD format
    startTime: string;       // HH:mm format
    endTime?: string;
    reason: string;
    notes?: string;
}

export interface IUpdateAppointment {
    appointmentDate?: string;
    startTime?: string;
    endTime?: string;
    status?: AppointmentStatus;
    reason?: string;
    notes?: string;
}

export interface IAppointmentFilter {
    patientId?: string;
    doctorId?: string;
    specialtyId?: string;
    startDate?: string;
    endDate?: string;
    status?: AppointmentStatus;
}

export interface IAvailableSlot {
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export interface IValidateSlot {
    doctorId: string;
    date: string;
    startTime: string;
}
