import { ISpecialtyRepository } from '../../../../domain/port/specialty/specialty-repository';
import { Specialty, ISpecialty } from '../../../../domain/entity/specialty';
import { ICreateSpecialty, IUpdateSpecialty } from '../../../../domain/dto/specialty/specialty-dto';
import { SpecialtyModel } from '../schemas/specialty-schema';

export class MongoSpecialtyRepository implements ISpecialtyRepository {
    async create(data: ICreateSpecialty): Promise<Specialty> {
        const specialty = new SpecialtyModel(data);
        const saved = await specialty.save();
        return new Specialty(this.mapToEntity(saved));
    }

    async findById(id: string): Promise<Specialty | null> {
        const doc = await SpecialtyModel.findById(id);
        if (!doc) {
            return null;
        }
        return new Specialty(this.mapToEntity(doc));
    }

    async findAll(): Promise<Specialty[]> {
        const docs = await SpecialtyModel.find();
        return docs.map(doc => new Specialty(this.mapToEntity(doc)));
    }

    async update(id: string, data: IUpdateSpecialty): Promise<Specialty | null> {
        const doc = await SpecialtyModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );
        if (!doc) {
            return null;
        }
        return new Specialty(this.mapToEntity(doc));
    }

    async delete(id: string): Promise<boolean> {
        const result = await SpecialtyModel.findByIdAndDelete(id);
        return result !== null;
    }

    async existsByName(name: string): Promise<boolean> {
        const count = await SpecialtyModel.countDocuments({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });
        return count > 0;
    }

    private mapToEntity(doc: any): ISpecialty {
        return {
            id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
