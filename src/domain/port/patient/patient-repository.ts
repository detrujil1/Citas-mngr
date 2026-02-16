import { Patient } from '../../entity/patient';
import { IUpdatePatient } from '../../dto/patient/patient-dto';

export interface IPatientRepository {
    findById(id: string): Promise<Patient | null>;
    findByEmail(email: string): Promise<Patient | null>;
    update(id: string, data: IUpdatePatient): Promise<Patient | null>;
}
