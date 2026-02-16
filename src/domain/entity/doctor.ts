import { IWorkSchedule } from './work-schedule';
import { ISpecialty } from './specialty';

export interface IDoctor {
    id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    specialtyId: string;
    specialty?: ISpecialty;
    licenseNumber: string;
    workSchedule?: IWorkSchedule[];
    createdAt: Date;
    updatedAt: Date;
}

export class Doctor {
    constructor(private readonly data: IDoctor) {}

    get id(): string {
        return this.data.id;
    }

    get name(): string {
        return this.data.name;
    }

    get email(): string {
        return this.data.email;
    }

    get password(): string {
        return this.data.password;
    }

    get phone(): string | undefined {
        return this.data.phone;
    }

    get specialtyId(): string {
        return this.data.specialtyId;
    }

    get specialty(): ISpecialty | undefined {
        return this.data.specialty;
    }

    get licenseNumber(): string {
        return this.data.licenseNumber;
    }

    get workSchedule(): IWorkSchedule[] | undefined {
        return this.data.workSchedule;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    isAvailableAt(dayOfWeek: number, time: string): boolean {
        if (!this.data.workSchedule) return false;
        
        return this.data.workSchedule.some(schedule => 
            schedule.isActive &&
            schedule.dayOfWeek === dayOfWeek &&
            time >= schedule.startTime &&
            time < schedule.endTime
        );
    }
}
