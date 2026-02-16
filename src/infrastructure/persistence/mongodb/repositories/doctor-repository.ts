import { IDoctorRepository } from '../../../../domain/port/doctor/doctor-repository';
import { Doctor, IDoctor } from '../../../../domain/entity/doctor';
import { ICreateDoctor, IUpdateDoctor } from '../../../../domain/dto/doctor/doctor-dto';
import { DoctorModel } from '../schemas/doctor-schema';
import { SpecialtyModel } from '../schemas/specialty-schema';

export class MongoDoctorRepository implements IDoctorRepository {
    async create(data: ICreateDoctor): Promise<Doctor> {
        const doctor = new DoctorModel(data);
        const saved = await doctor.save();
        return new Doctor(await this.mapToEntity(saved));
    }

    async findById(id: string): Promise<Doctor | null> {
        const doc = await DoctorModel.findById(id);
        if (!doc) {
            return null;
        }
        return new Doctor(await this.mapToEntity(doc));
    }

    async findByEmail(email: string): Promise<Doctor | null> {
        const doc = await DoctorModel.findOne({ email });
        if (!doc) {
            return null;
        }
        return new Doctor(await this.mapToEntity(doc));
    }

    async findBySpecialty(specialtyId: string): Promise<Doctor[]> {
        const docs = await DoctorModel.find({ specialtyId });
        const doctors = await Promise.all(docs.map(doc => this.mapToEntity(doc)));
        return doctors.map(data => new Doctor(data));
    }

    async findAll(): Promise<Doctor[]> {
        const docs = await DoctorModel.find();
        const doctors = await Promise.all(docs.map(doc => this.mapToEntity(doc)));
        return doctors.map(data => new Doctor(data));
    }

    async update(id: string, data: IUpdateDoctor): Promise<Doctor | null> {
        const doc = await DoctorModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );
        if (!doc) {
            return null;
        }
        return new Doctor(await this.mapToEntity(doc));
    }

    async delete(id: string): Promise<boolean> {
        const result = await DoctorModel.findByIdAndDelete(id);
        return result !== null;
    }

    private async mapToEntity(doc: any): Promise<IDoctor> {
        // Obtener la especialidad
        const specialty = await SpecialtyModel.findById(doc.specialtyId);
        
        return {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            password: doc.password,
            phone: doc.phone,
            specialtyId: doc.specialtyId.toString(),
            specialty: specialty ? {
                id: specialty._id.toString(),
                name: specialty.name,
                description: specialty.description,
                createdAt: specialty.createdAt,
                updatedAt: specialty.updatedAt,
            } : undefined,
            licenseNumber: doc.licenseNumber,
            workSchedule: doc.workSchedule ? doc.workSchedule.map((s: any) => ({
                dayOfWeek: s.dayOfWeek,
                startTime: s.startTime,
                endTime: s.endTime,
                isActive: s.isActive,
            })) : [],
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
