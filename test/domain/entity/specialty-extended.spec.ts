import { Specialty, ISpecialty } from '../../../src/domain/entity/specialty';

describe('Specialty entity', () => {
    const baseData: ISpecialty = {
        id: 's1',
        name: 'Cardiology',
        description: 'Heart specialist',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z'),
    };

    it('should expose all getters correctly', () => {
        const specialty = new Specialty(baseData);
        expect(specialty.id).toBe(baseData.id);
        expect(specialty.name).toBe(baseData.name);
        expect(specialty.description).toBe(baseData.description);
        expect(specialty.createdAt).toEqual(baseData.createdAt);
        expect(specialty.updatedAt).toEqual(baseData.updatedAt);
    });
});
