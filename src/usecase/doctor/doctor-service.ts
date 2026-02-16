import { IDoctorRepository } from '../../domain/port/doctor/doctor-repository';
import { ISpecialtyRepository } from '../../domain/port/specialty/specialty-repository';
import { ICreateDoctor, IUpdateDoctor } from '../../domain/dto/doctor/doctor-dto';
import { Doctor } from '../../domain/entity/doctor';

export class DoctorService {
    constructor(
        private readonly doctorRepository: IDoctorRepository,
        private readonly specialtyRepository: ISpecialtyRepository
    ) {}

    async create(data: ICreateDoctor): Promise<Doctor> {
        // Verificar que la especialidad exista
        const specialty = await this.specialtyRepository.findById(data.specialtyId);
        if (!specialty) {
            throw new Error('Specialty not found');
        }

        // Verificar que el email no esté ya registrado
        const existingDoctor = await this.doctorRepository.findByEmail(data.email);
        if (existingDoctor) {
            throw new Error('Email already registered');
        }

        return await this.doctorRepository.create(data);
    }

    async findById(id: string): Promise<Doctor> {
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return doctor;
    }

    async findBySpecialty(specialtyId: string): Promise<Doctor[]> {
        return await this.doctorRepository.findBySpecialty(specialtyId);
    }

    async findAll(): Promise<Doctor[]> {
        return await this.doctorRepository.findAll();
    }

    async update(id: string, data: IUpdateDoctor): Promise<Doctor> {
        const exists = await this.doctorRepository.findById(id);
        if (!exists) {
            throw new Error('Doctor not found');
        }

        // Si se actualiza la especialidad, verificar que exista
        if (data.specialtyId) {
            const specialty = await this.specialtyRepository.findById(data.specialtyId);
            if (!specialty) {
                throw new Error('Specialty not found');
            }
        }

        const updated = await this.doctorRepository.update(id, data);
        if (!updated) {
            throw new Error('Failed to update doctor');
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.doctorRepository.delete(id);
        if (!deleted) {
            throw new Error('Doctor not found or could not be deleted');
        }
    }
}
