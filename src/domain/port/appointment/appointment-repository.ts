import { Appointment } from "../../entity/appointment";
import { ICreateAppointment, IUpdateAppointment, IAppointmentFilter } from "../../dto/appointment/appointment-dto";

export interface IAppointmentRepository {
    create(data: ICreateAppointment): Promise<Appointment>;
    findById(id: string): Promise<Appointment | null>;
    findByFilter(filter: IAppointmentFilter): Promise<Appointment[]>;
    update(id: string, data: IUpdateAppointment): Promise<Appointment | null>;
    delete(id: string): Promise<boolean>;
    hasConflict(doctorId: string, date: Date, startTime: string, endTime: string, excludeId?: string): Promise<boolean>;
}
