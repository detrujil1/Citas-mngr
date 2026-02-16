import { AppointmentController } from '../../../../src/adapter/controller/appointment/appointment-controller';
import { AppointmentService } from '../../../../src/usecase/appointment/appointment-service';
import { Appointment } from '../../../../src/domain/entity/appointment';
import { AppointmentStatus } from '../../../../src/domain/entity/appointment';

describe('AppointmentController', () => {
    let controller: AppointmentController;
    let appointmentService: jest.Mocked<AppointmentService>;
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;

    beforeEach(() => {
        appointmentService = {
            create: jest.fn(),
            findByFilter: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            cancel: jest.fn(),
            delete: jest.fn(),
            getAvailableSlots: jest.fn(),
        } as unknown as jest.Mocked<AppointmentService>;

        controller = new AppointmentController(appointmentService);

        mockRequest = {
            body: {},
            params: {},
            query: {},
            user: {
                userId: 'user-1',
                email: 'test@example.com',
                role: 'PACIENTE',
            },
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();
    });

    describe('create', () => {
        it('should create appointment successfully', async () => {
            const createData = {
                doctorId: 'doc-1',
                appointmentDate: new Date(),
                startTime: '09:00',
                reason: 'Checkup',
            };

            const mockAppointment = new Appointment({
                id: 'appt-1',
                patientId: 'user-1',
                doctorId: 'doc-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date(),
                startTime: '09:00',
                endTime: '10:00',
                reason: 'Checkup',
                status: AppointmentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.body = createData;
            appointmentService.create.mockResolvedValue(mockAppointment);

            const router = (controller as any).router;
            const createHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await createHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...createData,
                    patientId: 'user-1',
                })
            );
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Appointment created successfully',
                    data: expect.any(Object)
                })
            );
        });

        it('should handle unauthenticated user', async () => {
            mockRequest.user = undefined;

            const router = (controller as any).router;
            const createHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await createHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.create).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('findByFilter', () => {
        it('should return appointments by filter', async () => {
            const mockAppointments = [
                new Appointment({
                    id: 'appt-1',
                    patientId: 'user-1',
                    doctorId: 'doc-1',
                    specialtyId: 'spec-1',
                    appointmentDate: new Date(),
                    startTime: '09:00',
                    endTime: '10:00',
                    reason: 'Checkup',
                    status: AppointmentStatus.PENDING,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];

            mockRequest.query = { doctorId: 'doc-1' };
            appointmentService.findByFilter.mockResolvedValue(mockAppointments);

            const router = (controller as any).router;
            const findByFilterHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await findByFilterHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.findByFilter).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: mockAppointments
                })
            );
        });
    });

    describe('getMyAppointments', () => {
        it('should return user appointments', async () => {
            const mockAppointments = [
                new Appointment({
                    id: 'appt-1',
                    patientId: 'user-1',
                    doctorId: 'doc-1',
                    specialtyId: 'spec-1',
                    appointmentDate: new Date(),
                    startTime: '09:00',
                    endTime: '10:00',
                    reason: 'Checkup',
                    status: AppointmentStatus.PENDING,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];

            appointmentService.findByFilter.mockResolvedValue(mockAppointments);

            const router = (controller as any).router;
            const getMyAppointmentsHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments/my-appointments' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await getMyAppointmentsHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.findByFilter).toHaveBeenCalledWith({ patientId: 'user-1' });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: mockAppointments
                })
            );
        });

        it('should handle unauthenticated user', async () => {
            mockRequest.user = undefined;

            const router = (controller as any).router;
            const getMyAppointmentsHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments/my-appointments' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await getMyAppointmentsHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('getAvailableSlots', () => {
        it('should return available slots', async () => {
            const mockSlots = [
                { date: '2024-01-15', startTime: '09:00', endTime: '10:00', isAvailable: true },
                { date: '2024-01-15', startTime: '10:00', endTime: '11:00', isAvailable: true },
                { date: '2024-01-15', startTime: '11:00', endTime: '12:00', isAvailable: true },
            ];

            mockRequest.params = { doctorId: 'doc-1' };
            mockRequest.query = { date: '2024-01-15' };
            appointmentService.getAvailableSlots.mockResolvedValue(mockSlots);

            const router = (controller as any).router;
            const getAvailableSlotsHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments/available-slots/:doctorId' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await getAvailableSlotsHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.getAvailableSlots).toHaveBeenCalledWith('doc-1', '2024-01-15');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: mockSlots
                })
            );
        });

        it('should handle missing date parameter', async () => {
            mockRequest.params = { doctorId: 'doc-1' };
            mockRequest.query = {};

            const router = (controller as any).router;
            const getAvailableSlotsHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments/available-slots/:doctorId' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await getAvailableSlotsHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.getAvailableSlots).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('findById', () => {
        it('should return appointment by id', async () => {
            const mockAppointment = new Appointment({
                id: 'appt-1',
                patientId: 'user-1',
                doctorId: 'doc-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date(),
                startTime: '09:00',
                endTime: '10:00',
                reason: 'Checkup',
                status: AppointmentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.params = { id: 'appt-1' };
            appointmentService.findById.mockResolvedValue(mockAppointment);

            const router = (controller as any).router;
            const findByIdHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments/:id' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await findByIdHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.findById).toHaveBeenCalledWith('appt-1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: mockAppointment
                })
            );
        });
    });

    describe('update', () => {
        it('should update appointment successfully', async () => {
            const updateData = {
                appointmentDate: new Date(), startTime: '09:00', endTime: '10:00',
                reason: 'Updated reason',
            };

            const mockAppointment = new Appointment({
                id: 'appt-1',
                patientId: 'user-1',
                doctorId: 'doc-1', specialtyId: 'spec-1',
                appointmentDate: updateData.appointmentDate,
                startTime: updateData.startTime,
                endTime: updateData.endTime,
                reason: updateData.reason,
                status: AppointmentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.params = { id: 'appt-1' };
            mockRequest.body = updateData;
            appointmentService.update.mockResolvedValue(mockAppointment);

            const router = (controller as any).router;
            const updateHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments/:id' && layer.route?.methods?.put
            )?.route?.stack[0]?.handle;

            await updateHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.update).toHaveBeenCalledWith('appt-1', updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Appointment updated successfully',
                    data: expect.any(Object)
                })
            );
        });
    });

    describe('cancel', () => {
        it('should cancel appointment successfully', async () => {
            const mockAppointment = new Appointment({
                id: 'appt-1',
                patientId: 'user-1',
                doctorId: 'doc-1',
                specialtyId: 'spec-1',
                appointmentDate: new Date(),
                startTime: '09:00',
                endTime: '10:00',
                reason: 'Checkup',
                status: AppointmentStatus.CANCELLED,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockRequest.params = { id: 'appt-1' };
            appointmentService.cancel.mockResolvedValue(mockAppointment);

            const router = (controller as any).router;
            const cancelHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments/:id/cancel' && layer.route?.methods?.patch
            )?.route?.stack[0]?.handle;

            await cancelHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.cancel).toHaveBeenCalledWith('appt-1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Appointment cancelled successfully',
                    data: expect.any(Object)
                })
            );
        });
    });

    describe('delete', () => {
        it('should delete appointment successfully', async () => {
            mockRequest.params = { id: 'appt-1' };
            appointmentService.delete.mockResolvedValue(undefined);

            const router = (controller as any).router;
            const deleteHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/appointments/:id' && layer.route?.methods?.delete
            )?.route?.stack[0]?.handle;

            await deleteHandler(mockRequest, mockResponse, mockNext);

            expect(appointmentService.delete).toHaveBeenCalledWith('appt-1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Appointment deleted successfully',
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

