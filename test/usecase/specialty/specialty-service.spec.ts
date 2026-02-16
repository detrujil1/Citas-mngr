import { SpecialtyService } from '../../../src/usecase/specialty/specialty-service';
import { ISpecialtyRepository } from '../../../src/domain/port/specialty/specialty-repository';
import { Specialty } from '../../../src/domain/entity/specialty';

describe('SpecialtyService', () => {
    let specialtyService: SpecialtyService;
    let mockRepository: jest.Mocked<ISpecialtyRepository>;

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            existsByName: jest.fn(),
        };
        specialtyService = new SpecialtyService(mockRepository);
    });

    describe('create', () => {
        it('should create a specialty when name does not exist', async () => {
            // Arrange
            const specialtyData = {
                name: 'Cardiology',
                description: 'Heart specialist',
            };
            const mockSpecialty = new Specialty({
                id: '1',
                name: 'Cardiology',
                description: 'Heart specialist',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRepository.existsByName.mockResolvedValue(false);
            mockRepository.create.mockResolvedValue(mockSpecialty);

            // Act
            const result = await specialtyService.create(specialtyData);

            // Assert
            expect(mockRepository.existsByName).toHaveBeenCalledWith('Cardiology');
            expect(mockRepository.create).toHaveBeenCalledWith(specialtyData);
            expect(result).toBe(mockSpecialty);
        });

        it('should throw error when specialty name already exists', async () => {
            // Arrange
            const specialtyData = {
                name: 'Cardiology',
                description: 'Heart specialist',
            };
            mockRepository.existsByName.mockResolvedValue(true);

            // Act & Assert
            await expect(specialtyService.create(specialtyData)).rejects.toThrow(
                'A specialty with this name already exists'
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return specialty when found', async () => {
            // Arrange
            const mockSpecialty = new Specialty({
                id: '1',
                name: 'Cardiology',
                description: 'Heart specialist',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockRepository.findById.mockResolvedValue(mockSpecialty);

            // Act
            const result = await specialtyService.findById('1');

            // Assert
            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(result).toBe(mockSpecialty);
        });

        it('should throw error when specialty not found', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(specialtyService.findById('999')).rejects.toThrow('Specialty not found');
        });
    });
});
