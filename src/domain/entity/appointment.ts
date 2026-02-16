export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW'
}

export interface IAppointment {
    id: string;
    patientId: string;
    doctorId: string;
    specialtyId: string;
    appointmentDate: Date;
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
    status: AppointmentStatus;
    reason: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Appointment {
    constructor(private readonly data: IAppointment) {}

    get id(): string {
        return this.data.id;
    }

    get patientId(): string {
        return this.data.patientId;
    }

    get doctorId(): string {
        return this.data.doctorId;
    }

    get specialtyId(): string {
        return this.data.specialtyId;
    }

    get appointmentDate(): Date {
        return this.data.appointmentDate;
    }

    get startTime(): string {
        return this.data.startTime;
    }

    get endTime(): string {
        return this.data.endTime;
    }

    get status(): AppointmentStatus {
        return this.data.status;
    }

    get reason(): string {
        return this.data.reason;
    }

    get notes(): string | undefined {
        return this.data.notes;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    isActive(): boolean {
        return this.data.status === AppointmentStatus.PENDING || 
               this.data.status === AppointmentStatus.CONFIRMED;
    }

    canBeCancelled(): boolean {
        return this.isActive();
    }

    canBeModified(): boolean {
        return this.data.status === AppointmentStatus.PENDING || 
               this.data.status === AppointmentStatus.CONFIRMED;
    }

    toJSON(): IAppointment {
        return {
            id: this.id,
            patientId: this.patientId,
            doctorId: this.doctorId,
            specialtyId: this.specialtyId,
            appointmentDate: this.appointmentDate,
            startTime: this.startTime,
            endTime: this.endTime,
            status: this.status,
            reason: this.reason,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
