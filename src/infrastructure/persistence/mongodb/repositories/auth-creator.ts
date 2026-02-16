import { IRegisterDoctor, IRegisterPatient } from '../../../../domain/dto/auth/register-dto';
import { DoctorModel } from '../schemas/doctor-schema';
import { PatientModel } from '../schemas/patient-schema';

export class MongoAuthCreator {
    async createDoctor(data: IRegisterDoctor): Promise<any> {
        const doctor = new DoctorModel({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            specialtyId: data.specialtyId,
            licenseNumber: data.licenseNumber,
            workSchedule: data.workSchedule || [],
        });
        const saved = await doctor.save();
        return {
            id: saved._id.toString(),
            name: saved.name,
            email: saved.email,
            phone: saved.phone,
            specialtyId: saved.specialtyId.toString(),
            licenseNumber: saved.licenseNumber,
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
        };
    }

    async createPatient(data: IRegisterPatient): Promise<any> {
        const patient = new PatientModel({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            address: data.address,
            emergencyContact: data.emergencyContact,
        });
        const saved = await patient.save();
        return {
            id: saved._id.toString(),
            name: saved.name,
            email: saved.email,
            phone: saved.phone,
            dateOfBirth: saved.dateOfBirth,
            address: saved.address,
            emergencyContact: saved.emergencyContact,
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
        };
    }
}
