import { Specialty } from "../../entity/specialty";
import { ICreateSpecialty, IUpdateSpecialty } from "../../dto/specialty/specialty-dto";

export interface ISpecialtyRepository {
    create(data: ICreateSpecialty): Promise<Specialty>;
    findById(id: string): Promise<Specialty | null>;
    findAll(): Promise<Specialty[]>;
    update(id: string, data: IUpdateSpecialty): Promise<Specialty | null>;
    delete(id: string): Promise<boolean>;
    existsByName(name: string): Promise<boolean>;
}
