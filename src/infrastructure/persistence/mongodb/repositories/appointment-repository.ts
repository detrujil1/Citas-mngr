import { IAppointmentRepository } from '../../../../domain/port/appointment/appointment-repository';
import { Appointment, IAppointment, AppointmentStatus } from '../../../../domain/entity/appointment';
import { ICreateAppointment, IUpdateAppointment, IAppointmentFilter } from '../../../../domain/dto/appointment/appointment-dto';
import { AppointmentModel } from '../schemas/appointment-schema';

export class MongoAppointmentRepository implements IAppointmentRepository {
    async create(data: ICreateAppointment): Promise<Appointment> {
        const appointment = new AppointmentModel({
            ...data,
            appointmentDate: new Date(data.appointmentDate),
            status: AppointmentStatus.PENDING,
        });
        const saved = await appointment.save();
        return new Appointment(this.mapToEntity(saved));
    }

    async findById(id: string): Promise<Appointment | null> {
        const doc = await AppointmentModel.findById(id);
        if (!doc) {
            return null;
        }
        return new Appointment(this.mapToEntity(doc));
    }

    async findByFilter(filter: IAppointmentFilter): Promise<Appointment[]> {
        const query: any = {};

        if (filter.patientId) {
            query.patientId = filter.patientId;
        }
        if (filter.doctorId) {
            query.doctorId = filter.doctorId;
        }
        if (filter.specialtyId) {
            query.specialtyId = filter.specialtyId;
        }
        if (filter.status) {
            query.status = filter.status;
        }
        if (filter.startDate || filter.endDate) {
            query.appointmentDate = {};
            if (filter.startDate) {
                query.appointmentDate.$gte = new Date(filter.startDate);
            }
            if (filter.endDate) {
                query.appointmentDate.$lte = new Date(filter.endDate);
            }
        }

        const docs = await AppointmentModel.find(query).sort({ appointmentDate: 1, startTime: 1 });
        return docs.map(doc => new Appointment(this.mapToEntity(doc)));
    }

    async update(id: string, data: IUpdateAppointment): Promise<Appointment | null> {
        const updateData: any = { ...data };
        if (data.appointmentDate) {
            updateData.appointmentDate = new Date(data.appointmentDate);
        }

        const doc = await AppointmentModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        if (!doc) {
            return null;
        }
        return new Appointment(this.mapToEntity(doc));
    }

    async delete(id: string): Promise<boolean> {
        const result = await AppointmentModel.findByIdAndDelete(id);
        return result !== null;
    }

    async hasConflict(
        doctorId: string,
        date: Date,
        startTime: string,
        endTime: string,
        excludeId?: string
    ): Promise<boolean> {
        const query: any = {
            doctorId,
            appointmentDate: date,
            status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
            $or: [
                // Nueva cita empieza durante una existente
                { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
                // Nueva cita termina durante una existente
                { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
                // Nueva cita envuelve una existente
                { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
            ],
        };

        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const count = await AppointmentModel.countDocuments(query);
        return count > 0;
    }

    private mapToEntity(doc: any): IAppointment {
        return {
            id: doc._id.toString(),
            patientId: doc.patientId.toString(),
            doctorId: doc.doctorId.toString(),
            specialtyId: doc.specialtyId.toString(),
            appointmentDate: doc.appointmentDate,
            startTime: doc.startTime,
            endTime: doc.endTime,
            status: doc.status,
            reason: doc.reason,
            notes: doc.notes,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
