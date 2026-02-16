import { Doctor } from "../../entity/doctor";
import { ICreateDoctor, IUpdateDoctor } from "../../dto/doctor/doctor-dto";

export interface IDoctorRepository {
    create(data: ICreateDoctor): Promise<Doctor>;
    findById(id: string): Promise<Doctor | null>;
    findByEmail(email: string): Promise<Doctor | null>;
    findBySpecialty(specialtyId: string): Promise<Doctor[]>;
    findAll(): Promise<Doctor[]>;
    update(id: string, data: IUpdateDoctor): Promise<Doctor | null>;
    delete(id: string): Promise<boolean>;
}
