export interface IWorkScheduleDTO {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

export interface IUpdateDoctorSchedule {
    schedules: IWorkScheduleDTO[];
}
