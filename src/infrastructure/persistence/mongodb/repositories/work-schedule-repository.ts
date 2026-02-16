import { IWorkScheduleRepository } from '../../../../domain/port/work-schedule/work-schedule-repository';
import { WorkSchedule, IWorkSchedule } from '../../../../domain/entity/work-schedule';
import { IWorkScheduleDTO } from '../../../../domain/dto/work-schedule/work-schedule-dto';
import { WorkScheduleModel } from '../schemas/work-schedule-schema';

export class MongoWorkScheduleRepository implements IWorkScheduleRepository {
    async findByDoctorId(doctorId: string): Promise<WorkSchedule[]> {
        const docs = await WorkScheduleModel.find({ doctorId });
        return docs.map(doc => new WorkSchedule(this.mapToEntity(doc)));
    }

    async updateSchedules(doctorId: string, schedules: IWorkScheduleDTO[]): Promise<WorkSchedule[]> {
        // Eliminar schedules anteriores
        await WorkScheduleModel.deleteMany({ doctorId });

        // Crear nuevos schedules
        const docs = await WorkScheduleModel.insertMany(
            schedules.map(schedule => ({
                doctorId,
                ...schedule,
            }))
        );

        return docs.map(doc => new WorkSchedule(this.mapToEntity(doc)));
    }

    async deleteByDoctorId(doctorId: string): Promise<void> {
        await WorkScheduleModel.deleteMany({ doctorId });
    }

    private mapToEntity(doc: any): IWorkSchedule {
        return {
            id: doc._id.toString(),
            doctorId: doc.doctorId.toString(),
            dayOfWeek: doc.dayOfWeek,
            startTime: doc.startTime,
            endTime: doc.endTime,
            isActive: doc.isActive,
        };
    }
}
