import { Response, NextFunction } from 'express';
import { SpecialtyController } from '../../../../src/adapter/controller/specialty/specialty-controller';
import { SpecialtyService } from '../../../../src/usecase/specialty/specialty-service';
import { IRequest } from '../../../../src/infrastructure/adapter/http/header';
import { Specialty } from '../../../../src/domain/entity/specialty';

describe('SpecialtyController', () => {
    let controller: SpecialtyController;
    let specialtyService: jest.Mocked<SpecialtyService>;
    let mockRequest: Partial<IRequest>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        specialtyService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<SpecialtyService>;

        controller = new SpecialtyController(specialtyService);

        mockRequest = {
            body: {},
            params: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();
    });

    describe('create', () => {
        it('should create specialty successfully', async () => {
            const createData = {
                name: 'Cardiology',
                description: 'Heart specialist',
            };

            const mockSpecialty = new Specialty({
                id: 'spec-1',
                name: 'Cardiology',
                description: 'Heart specialist',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.body = createData;
            specialtyService.create.mockResolvedValue(mockSpecialty);

            const router = (controller as any).router;
            const createHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await createHandler(mockRequest, mockResponse, mockNext);

            expect(specialtyService.create).toHaveBeenCalledWith(createData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Specialty created successfully',
                    data: expect.any(Object)
                })
            );
        });

        it('should handle create errors', async () => {
            mockRequest.body = { name: 'Test' };
            specialtyService.create.mockRejectedValue(new Error('Creation failed'));

            const router = (controller as any).router;
            const createHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await createHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Creation failed'
                })
            );
        });
    });

    describe('findAll', () => {
        it('should return all specialties', async () => {
            const mockSpecialties = [
                new Specialty({
                    id: 'spec-1',
                    name: 'Cardiology',
                    description: 'Heart',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
                new Specialty({
                    id: 'spec-2',
                    name: 'Neurology',
                    description: 'Brain',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];

            specialtyService.findAll.mockResolvedValue(mockSpecialties);

            const router = (controller as any).router;
            const findAllHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await findAllHandler(mockRequest, mockResponse, mockNext);

            expect(specialtyService.findAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: mockSpecialties
                })
            );
        });

        it('should handle findAll errors', async () => {
            specialtyService.findAll.mockRejectedValue(new Error('Database error'));

            const router = (controller as any).router;
            const findAllHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await findAllHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 500,
                    message: 'Database error'
                })
            );
        });
    });

    describe('findById', () => {
        it('should return specialty by id', async () => {
            const mockSpecialty = new Specialty({
                id: 'spec-1',
                name: 'Cardiology',
                description: 'Heart specialist',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.params = { id: 'spec-1' };
            specialtyService.findById.mockResolvedValue(mockSpecialty);

            const router = (controller as any).router;
            const findByIdHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties/:id' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await findByIdHandler(mockRequest, mockResponse, mockNext);

            expect(specialtyService.findById).toHaveBeenCalledWith('spec-1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: mockSpecialty
                })
            );
        });

        it('should handle not found error', async () => {
            mockRequest.params = { id: 'invalid-id' };
            specialtyService.findById.mockRejectedValue(new Error('Specialty not found'));

            const router = (controller as any).router;
            const findByIdHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties/:id' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await findByIdHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'Specialty not found'
                })
            );
        });
    });

    describe('update', () => {
        it('should update specialty successfully', async () => {
            const updateData = {
                name: 'Updated Cardiology',
                description: 'Updated description',
            };

            const mockUpdatedSpecialty = new Specialty({
                id: 'spec-1',
                name: 'Updated Cardiology',
                description: 'Updated description',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.params = { id: 'spec-1' };
            mockRequest.body = updateData;
            specialtyService.update.mockResolvedValue(mockUpdatedSpecialty);

            const router = (controller as any).router;
            const updateHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties/:id' && layer.route?.methods?.put
            )?.route?.stack[0]?.handle;

            await updateHandler(mockRequest, mockResponse, mockNext);

            expect(specialtyService.update).toHaveBeenCalledWith('spec-1', updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Specialty updated successfully',
                    data: expect.any(Object)
                })
            );
        });

        it('should handle update errors', async () => {
            mockRequest.params = { id: 'spec-1' };
            mockRequest.body = { name: 'Test' };
            specialtyService.update.mockRejectedValue(new Error('Update failed'));

            const router = (controller as any).router;
            const updateHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties/:id' && layer.route?.methods?.put
            )?.route?.stack[0]?.handle;

            await updateHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Update failed'
                })
            );
        });
    });

    describe('delete', () => {
        it('should delete specialty successfully', async () => {
            mockRequest.params = { id: 'spec-1' };
            specialtyService.delete.mockResolvedValue(undefined);

            const router = (controller as any).router;
            const deleteHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties/:id' && layer.route?.methods?.delete
            )?.route?.stack[0]?.handle;

            await deleteHandler(mockRequest, mockResponse, mockNext);

            expect(specialtyService.delete).toHaveBeenCalledWith('spec-1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Specialty deleted successfully',
                    data: expect.any(Object)
                })
            );
        });

        it('should handle delete errors', async () => {
            mockRequest.params = { id: 'spec-1' };
            specialtyService.delete.mockRejectedValue(new Error('Delete failed'));

            const router = (controller as any).router;
            const deleteHandler = router.stack.find((layer: any) => 
                layer.route?.path === '/specialties/:id' && layer.route?.methods?.delete
            )?.route?.stack[0]?.handle;

            await deleteHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(Error)
            );
        });
    });

    describe('getRouter', () => {
        it('should return router instance', () => {
            const router = controller.getRouter();
            expect(router).toBeDefined();
        });
    });
});
