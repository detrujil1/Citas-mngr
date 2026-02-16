import { IPatientRepository } from '../../../../domain/port/patient/patient-repository';
import { Patient, IPatient } from '../../../../domain/entity/patient';
import { IUpdatePatient } from '../../../../domain/dto/patient/patient-dto';
import { PatientModel } from '../schemas/patient-schema';

export class MongoPatientRepository implements IPatientRepository {
    async findById(id: string): Promise<Patient | null> {
        const doc = await PatientModel.findById(id);
        if (!doc) {
            return null;
        }
        return new Patient(this.mapToEntity(doc));
    }

    async findByEmail(email: string): Promise<Patient | null> {
        const doc = await PatientModel.findOne({ email });
        if (!doc) {
            return null;
        }
        return new Patient(this.mapToEntity(doc));
    }

    async update(id: string, data: IUpdatePatient): Promise<Patient | null> {
        const updateData: any = { ...data };
        if (data.dateOfBirth) {
            updateData.dateOfBirth = new Date(data.dateOfBirth);
        }

        const doc = await PatientModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        if (!doc) {
            return null;
        }
        return new Patient(this.mapToEntity(doc));
    }

    private mapToEntity(doc: any): IPatient {
        return {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            password: doc.password,
            phone: doc.phone,
            dateOfBirth: doc.dateOfBirth,
            address: doc.address,
            emergencyContact: doc.emergencyContact,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
