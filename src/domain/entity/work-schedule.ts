export interface IWorkSchedule {
    id: string;
    doctorId: string;
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
    isActive: boolean;
}

export class WorkSchedule {
    constructor(private readonly data: IWorkSchedule) {}

    get id(): string {
        return this.data.id;
    }

    get doctorId(): string {
        return this.data.doctorId;
    }

    get dayOfWeek(): number {
        return this.data.dayOfWeek;
    }

    get startTime(): string {
        return this.data.startTime;
    }

    get endTime(): string {
        return this.data.endTime;
    }

    get isActive(): boolean {
        return this.data.isActive;
    }
}
