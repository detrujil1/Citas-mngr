import { WorkSchedule } from '../../entity/work-schedule';
import { IWorkScheduleDTO } from '../../dto/work-schedule/work-schedule-dto';

export interface IWorkScheduleRepository {
    findByDoctorId(doctorId: string): Promise<WorkSchedule[]>;
    updateSchedules(doctorId: string, schedules: IWorkScheduleDTO[]): Promise<WorkSchedule[]>;
    deleteByDoctorId(doctorId: string): Promise<void>;
}
