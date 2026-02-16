import { SpecialtyService } from '../../../src/usecase/specialty/specialty-service';

describe('SpecialtyService - extended coverage', () => {
    let service: SpecialtyService;
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            existsByName: jest.fn(),
        };
        service = new SpecialtyService(mockRepository);
    });

    it('should throw error if update name already exists', async () => {
        mockRepository.findById.mockResolvedValue({ id: 's1', name: 'Cardiology' });
        mockRepository.existsByName.mockResolvedValue(true);
        await expect(service.update('s1', { name: 'Neurology' })).rejects.toThrow('A specialty with this name already exists');
    });

    it('should throw error if update fails', async () => {
        mockRepository.findById.mockResolvedValue({ id: 's1', name: 'Cardiology' });
        mockRepository.existsByName.mockResolvedValue(false);
        mockRepository.update.mockResolvedValue(null);
        await expect(service.update('s1', { name: 'Neurology' })).rejects.toThrow('Failed to update specialty');
    });

    it('should update specialty if name does not exist', async () => {
        const mockSpecialty = { id: 's1', name: 'Updated', description: 'New desc' };
        mockRepository.findById.mockResolvedValue({ id: 's1', name: 'Old' });
        mockRepository.existsByName.mockResolvedValue(false);
        mockRepository.update.mockResolvedValue(mockSpecialty);
        await expect(service.update('s1', { name: 'Updated' })).resolves.toEqual(mockSpecialty);
    });

    it('should delete specialty if exists', async () => {
        mockRepository.delete.mockResolvedValue(true);
        await expect(service.delete('s1')).resolves.toBeUndefined();
    });

    it('should throw error if delete fails', async () => {
        mockRepository.delete.mockResolvedValue(false);
        await expect(service.delete('s1')).rejects.toThrow('Specialty not found or could not be deleted');
    });
});
