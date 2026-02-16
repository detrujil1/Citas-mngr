import { DoctorController } from '../../../../src/adapter/controller/doctor/doctor-controller';
import { DoctorService } from '../../../../src/usecase/doctor/doctor-service';
import { Doctor } from '../../../../src/domain/entity/doctor';

describe('DoctorController', () => {
    let controller: DoctorController;
    let doctorService: jest.Mocked<DoctorService>;
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;

    beforeEach(() => {
        doctorService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findBySpecialty: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<DoctorService>;

        controller = new DoctorController(doctorService);

        mockRequest = {
            body: {},
            params: {},
            query: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();
    });

    describe('create', () => {
        it('should create doctor successfully', async () => {
            const createData = {
                name: 'Dr. Smith',
                email: 'smith@example.com',
                phone: '123456789',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC123',
            };

            const mockDoctor = new Doctor({
                id: 'doc-1',
                name: 'Dr. Smith',
                email: 'smith@example.com',
                phone: '123456789',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC123',
                workSchedule: [],
                password: 'hashed-password',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.body = createData;
            doctorService.create.mockResolvedValue(mockDoctor);

            const router = (controller as any).router;
            const createHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/doctors' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await createHandler(mockRequest, mockResponse, mockNext);

            expect(doctorService.create).toHaveBeenCalledWith(createData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Doctor created successfully',
                    data: expect.any(Object)
                })
            );
        });

        it('should handle create errors', async () => {
            mockRequest.body = { name: 'Dr. Test' };
            doctorService.create.mockRejectedValue(new Error('Creation failed'));

            const router = (controller as any).router;
            const createHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/doctors' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await createHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('findAll', () => {
        it('should return all doctors', async () => {
            const mockDoctors = [
                new Doctor({
                    id: 'doc-1',
                    name: 'Dr. Smith',
                    email: 'smith@example.com',
                    phone: '123456789',
                    specialtyId: 'spec-1',
                    licenseNumber: 'LIC123',
                    workSchedule: [],
                    password: 'hashed-password',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];

            doctorService.findAll.mockResolvedValue(mockDoctors);

            const router = (controller as any).router;
            const findAllHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/doctors' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await findAllHandler(mockRequest, mockResponse, mockNext);

            expect(doctorService.findAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.any(Array)
                })
            );
        });
    });

    describe('findById', () => {
        it('should return doctor by id', async () => {
            const mockDoctor = new Doctor({
                id: 'doc-1',
                name: 'Dr. Smith',
                email: 'smith@example.com',
                phone: '123456789',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC123',
                workSchedule: [],
                password: 'hashed-password',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.params = { id: 'doc-1' };
            doctorService.findById.mockResolvedValue(mockDoctor);

            const router = (controller as any).router;
            const findByIdHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/doctors/:id' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await findByIdHandler(mockRequest, mockResponse, mockNext);

            expect(doctorService.findById).toHaveBeenCalledWith('doc-1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: mockDoctor
                })
            );
        });
    });

    describe('findBySpecialty', () => {
        it('should return doctors by specialty', async () => {
            const mockDoctors = [
                new Doctor({
                    id: 'doc-1',
                    name: 'Dr. Smith',
                    email: 'smith@example.com',
                    phone: '123456789',
                    specialtyId: 'spec-1',
                    licenseNumber: 'LIC123',
                    workSchedule: [],
                    password: 'hashed-password',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];

            mockRequest.params = { specialtyId: 'spec-1' };
            doctorService.findBySpecialty.mockResolvedValue(mockDoctors);

            const router = (controller as any).router;
            const findBySpecialtyHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/doctors/specialty/:specialtyId' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await findBySpecialtyHandler(mockRequest, mockResponse, mockNext);

            expect(doctorService.findBySpecialty).toHaveBeenCalledWith('spec-1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.any(Array)
                })
            );
        });
    });

    describe('update', () => {
        it('should update doctor successfully', async () => {
            const updateData = {
                name: 'Dr. Updated',
                phone: '987654321',
            };

            const mockDoctor = new Doctor({
                id: 'doc-1',
                name: 'Dr. Updated',
                email: 'smith@example.com',
                phone: '987654321',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC123',
                workSchedule: [],
                password: 'hashed-password',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.params = { id: 'doc-1' };
            mockRequest.body = updateData;
            doctorService.update.mockResolvedValue(mockDoctor);

            const router = (controller as any).router;
            const updateHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/doctors/:id' && layer.route?.methods?.put
            )?.route?.stack[0]?.handle;

            await updateHandler(mockRequest, mockResponse, mockNext);

            expect(doctorService.update).toHaveBeenCalledWith('doc-1', updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Doctor updated successfully',
                    data: expect.any(Object)
                })
            );
        });
    });

    describe('delete', () => {
        it('should delete doctor successfully', async () => {
            mockRequest.params = { id: 'doc-1' };
            doctorService.delete.mockResolvedValue(undefined);

            const router = (controller as any).router;
            const deleteHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/doctors/:id' && layer.route?.methods?.delete
            )?.route?.stack[0]?.handle;

            await deleteHandler(mockRequest, mockResponse, mockNext);

            expect(doctorService.delete).toHaveBeenCalledWith('doc-1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Doctor deleted successfully',
                    data: expect.any(Object)
                })
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


