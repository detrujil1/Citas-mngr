import { SignUpUserController } from '../../../../../src/adapter/controller/user/signup/sign-up-controller';
import { ISignUpExecutor } from '../../../../../src/domain/port/user/signup/in/signup-executor';
import { UserRole } from '../../../../../src/domain/entity/user';

describe('SignUpUserController', () => {
    let controller: SignUpUserController;
    let signUpService: jest.Mocked<ISignUpExecutor>;
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;

    beforeEach(() => {
        signUpService = {
            execute: jest.fn(),
        } as jest.Mocked<ISignUpExecutor>;

        controller = new SignUpUserController(signUpService);

        mockRequest = {
            body: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();
    });

    describe('signUp', () => {
        it('should register user successfully', async () => {
            const signUpData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'John Doe',
                role: UserRole.PACIENTE,
            };

            mockRequest.body = signUpData;
            signUpService.execute.mockResolvedValue(undefined);

            const router = controller.getRouter();
            const signUpHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/signup' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await signUpHandler(mockRequest, mockResponse, mockNext);

            expect(signUpService.execute).toHaveBeenCalledWith(signUpData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'User registered successfully',
                    data: expect.any(Object)
                })
            );
        });

        it('should handle missing required fields', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                // missing password, name, role
            };

            const router = controller.getRouter();
            const signUpHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/signup' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await signUpHandler(mockRequest, mockResponse, mockNext);

            expect(signUpService.execute).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(
                expect.any(Error)
            );
        });

        it('should handle missing email', async () => {
            mockRequest.body = {
                password: 'password123',
                name: 'John Doe',
                role: UserRole.PACIENTE,
            };

            const router = controller.getRouter();
            const signUpHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/signup' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await signUpHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should handle missing password', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                name: 'John Doe',
                role: UserRole.PACIENTE,
            };

            const router = controller.getRouter();
            const signUpHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/signup' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await signUpHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should handle missing name', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
                role: UserRole.PACIENTE,
            };

            const router = controller.getRouter();
            const signUpHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/signup' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await signUpHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should handle missing role', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
                name: 'John Doe',
            };

            const router = controller.getRouter();
            const signUpHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/signup' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await signUpHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should handle service execution errors', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
                name: 'John Doe',
                role: UserRole.PACIENTE,
            };

            signUpService.execute.mockRejectedValue(new Error('Email already exists'));

            const router = controller.getRouter();
            const signUpHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/signup' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await signUpHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should register doctor successfully', async () => {
            const signUpData = {
                email: 'doctor@example.com',
                password: 'password123',
                name: 'Dr. Smith',
                role: UserRole.MEDICO,
            };

            mockRequest.body = signUpData;
            signUpService.execute.mockResolvedValue(undefined);

            const router = controller.getRouter();
            const signUpHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/signup' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await signUpHandler(mockRequest, mockResponse, mockNext);

            expect(signUpService.execute).toHaveBeenCalledWith(signUpData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });

        it('should register admin successfully', async () => {
            const signUpData = {
                email: 'admin@example.com',
                password: 'password123',
                name: 'Admin User',
                role: UserRole.ADMIN,
            };

            mockRequest.body = signUpData;
            signUpService.execute.mockResolvedValue(undefined);

            const router = controller.getRouter();
            const signUpHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/signup' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await signUpHandler(mockRequest, mockResponse, mockNext);

            expect(signUpService.execute).toHaveBeenCalledWith(signUpData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });
    });

    describe('getRouter', () => {
        it('should return router instance', () => {
            const router = controller.getRouter();
            expect(router).toBeDefined();
        });
    });
});


