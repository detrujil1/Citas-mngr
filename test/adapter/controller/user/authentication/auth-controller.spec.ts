import { AuthenticationController } from '../../../../../src/adapter/controller/user/authentication/auth-controller';
import { AuthService } from '../../../../../src/usecase/auth/auth-service';

describe('AuthenticationController', () => {
    let controller: AuthenticationController;
    let authService: jest.Mocked<AuthService>;
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;

    beforeEach(() => {
        authService = {
            login: jest.fn(),
            registerDoctor: jest.fn(),
            registerPatient: jest.fn(),
        } as unknown as jest.Mocked<AuthService>;

        controller = new AuthenticationController(authService);

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

    describe('login', () => {
        it('should login successfully', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            };

            const authResponse = {
                token: 'jwt-token',
                user: { id: 'user-1', name: 'Test User', email: 'test@example.com', role: 'PACIENTE' },
            };

            mockRequest.body = loginData;
            authService.login.mockResolvedValue(authResponse);

            const router = (controller as any).router;
            const loginHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/login' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await loginHandler(mockRequest, mockResponse, mockNext);

            expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: authResponse
                })
            );
        });

        it('should handle missing email', async () => {
            mockRequest.body = { password: 'password123' };

            const router = (controller as any).router;
            const loginHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/login' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await loginHandler(mockRequest, mockResponse, mockNext);

            expect(authService.login).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should handle missing password', async () => {
            mockRequest.body = { email: 'test@example.com' };

            const router = (controller as any).router;
            const loginHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/login' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await loginHandler(mockRequest, mockResponse, mockNext);

            expect(authService.login).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should handle invalid credentials', async () => {
            mockRequest.body = { email: 'test@example.com', password: 'wrong' };
            authService.login.mockRejectedValue(new Error('Invalid credentials'));

            const router = (controller as any).router;
            const loginHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/login' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await loginHandler(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('registerDoctor', () => {
        it('should register doctor successfully', async () => {
            const registerData = {
                name: 'Dr. Smith',
                email: 'doctor@example.com',
                password: 'password123',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC123',
            };

            const authResponse = {
                token: 'jwt-token',
                user: { id: 'doc-1', name: 'Dr. Smith', email: 'doctor@example.com', role: 'MEDICO' },
            };

            mockRequest.body = registerData;
            authService.registerDoctor.mockResolvedValue(authResponse);

            const router = (controller as any).router;
            const registerHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/register/doctor' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await registerHandler(mockRequest, mockResponse, mockNext);

            expect(authService.registerDoctor).toHaveBeenCalledWith(registerData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: authResponse
                })
            );
        });

        it('should handle missing required fields', async () => {
            mockRequest.body = { name: 'Dr. Smith' };

            const router = (controller as any).router;
            const registerHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/register/doctor' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await registerHandler(mockRequest, mockResponse, mockNext);

            expect(authService.registerDoctor).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should handle short password', async () => {
            mockRequest.body = {
                name: 'Dr. Smith',
                email: 'doctor@example.com',
                password: '123',
                specialtyId: 'spec-1',
                licenseNumber: 'LIC123',
            };

            const router = (controller as any).router;
            const registerHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/register/doctor' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await registerHandler(mockRequest, mockResponse, mockNext);

            expect(authService.registerDoctor).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('registerPatient', () => {
        it('should register patient successfully', async () => {
            const registerData = {
                name: 'John Doe',
                email: 'patient@example.com',
                password: 'password123',
            };

            const authResponse = {
                token: 'jwt-token',
                user: { id: 'patient-1', name: 'John Doe', email: 'patient@example.com', role: 'PACIENTE' },
            };

            mockRequest.body = registerData;
            authService.registerPatient.mockResolvedValue(authResponse);

            const router = (controller as any).router;
            const registerHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/register/patient' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await registerHandler(mockRequest, mockResponse, mockNext);

            expect(authService.registerPatient).toHaveBeenCalledWith(registerData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: authResponse
                })
            );
        });

        it('should handle missing required fields', async () => {
            mockRequest.body = { name: 'John Doe' };

            const router = (controller as any).router;
            const registerHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/register/patient' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await registerHandler(mockRequest, mockResponse, mockNext);

            expect(authService.registerPatient).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should handle short password', async () => {
            mockRequest.body = {
                name: 'John Doe',
                email: 'patient@example.com',
                password: '123',
            };

            const router = (controller as any).router;
            const registerHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/register/patient' && layer.route?.methods?.post
            )?.route?.stack[0]?.handle;

            await registerHandler(mockRequest, mockResponse, mockNext);

            expect(authService.registerPatient).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('verify', () => {
        it('should verify token successfully', async () => {
            const router = (controller as any).router;
            const verifyHandler: any = router.stack.find((layer: any) => 
                layer.route?.path === '/auth/verify' && layer.route?.methods?.get
            )?.route?.stack[0]?.handle;

            await verifyHandler(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { valid: true }
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
