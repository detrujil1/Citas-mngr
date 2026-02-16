import { ISpecialtyRepository } from '../../domain/port/specialty/specialty-repository';
import { ICreateSpecialty, IUpdateSpecialty } from '../../domain/dto/specialty/specialty-dto';
import { Specialty } from '../../domain/entity/specialty';

export class SpecialtyService {
    constructor(private readonly repository: ISpecialtyRepository) {}

    async create(data: ICreateSpecialty): Promise<Specialty> {
        // Verificar que no exista una especialidad con el mismo nombre
        const exists = await this.repository.existsByName(data.name);
        if (exists) {
            throw new Error('A specialty with this name already exists');
        }

        return await this.repository.create(data);
    }

    async findById(id: string): Promise<Specialty> {
        const specialty = await this.repository.findById(id);
        if (!specialty) {
            throw new Error('Specialty not found');
        }
        return specialty;
    }

    async findAll(): Promise<Specialty[]> {
        return await this.repository.findAll();
    }

    async update(id: string, data: IUpdateSpecialty): Promise<Specialty> {
        // Verificar que la especialidad exista
        const exists = await this.repository.findById(id);
        if (!exists) {
            throw new Error('Specialty not found');
        }

        // Si se está actualizando el nombre, verificar que no exista otro con ese nombre
        if (data.name) {
            const nameExists = await this.repository.existsByName(data.name);
            if (nameExists) {
                throw new Error('A specialty with this name already exists');
            }
        }

        const updated = await this.repository.update(id, data);
        if (!updated) {
            throw new Error('Failed to update specialty');
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.repository.delete(id);
        if (!deleted) {
            throw new Error('Specialty not found or could not be deleted');
        }
    }
}
