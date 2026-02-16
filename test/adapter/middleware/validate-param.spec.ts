import { Request, Response, NextFunction } from 'express';
import { validateRequestHeaders, validateRequestBody } from '../../../src/adapter/middleware/validate-param';

describe('ValidateParam Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {},
            method: 'POST',
            body: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        nextFunction = jest.fn();
    });

    describe('validateRequestHeaders', () => {
        it('should call next without checking headers', () => {
            validateRequestHeaders(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should always pass through', () => {
            mockRequest.headers = {};

            validateRequestHeaders(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });

    describe('validateRequestBody', () => {
        it('should call next for GET requests without body validation', () => {
            mockRequest.method = 'GET';
            mockRequest.body = undefined;

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should call next for DELETE requests without body validation', () => {
            mockRequest.method = 'DELETE';
            mockRequest.body = undefined;

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should return 400 if content-type is not application/json for POST', () => {
            mockRequest.method = 'POST';
            mockRequest.headers = { 'content-type': 'text/plain' };
            mockRequest.body = { data: 'test' };

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Content-Type must be application/json',
                statusCode: 400,
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should return 400 if content-type is missing for POST', () => {
            mockRequest.method = 'POST';
            mockRequest.headers = {};
            mockRequest.body = { data: 'test' };

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Content-Type must be application/json',
                statusCode: 400,
            });
        });

        it('should return 400 if body is empty for POST', () => {
            mockRequest.method = 'POST';
            mockRequest.headers = { 'content-type': 'application/json' };
            mockRequest.body = {};

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Request body is required',
                statusCode: 400,
            });
        });

        it('should return 400 if body is null for POST', () => {
            mockRequest.method = 'POST';
            mockRequest.headers = { 'content-type': 'application/json' };
            mockRequest.body = null;

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Request body is required',
                statusCode: 400,
            });
        });

        it('should call next for POST with valid content-type and body', () => {
            mockRequest.method = 'POST';
            mockRequest.headers = { 'content-type': 'application/json' };
            mockRequest.body = { name: 'test', value: 123 };

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should accept application/json with charset', () => {
            mockRequest.method = 'POST';
            mockRequest.headers = { 'content-type': 'application/json; charset=utf-8' };
            mockRequest.body = { data: 'test' };

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should validate body for PUT requests', () => {
            mockRequest.method = 'PUT';
            mockRequest.headers = { 'content-type': 'application/json' };
            mockRequest.body = {};

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Request body is required',
                statusCode: 400,
            });
        });

        it('should validate body for PATCH requests', () => {
            mockRequest.method = 'PATCH';
            mockRequest.headers = {};
            mockRequest.body = { data: 'test' };

            validateRequestBody(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });
});
