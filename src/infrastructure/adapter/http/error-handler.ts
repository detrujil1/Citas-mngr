import { Request, Response, NextFunction } from 'express';
import { ResponseFactory } from './response-factory';
import { logger } from '../../../config/logger';

export class CustomError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: any
    ) {
        super(message);
    }
}

export function sendErrorResponse(
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const uuid = (req.headers['x-rquid'] as string) || 'UNKNOWN';
    let statusCode = 500;
    let message = 'Internal server error';

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err.message) {
        message = err.message;
        statusCode = err.statusCode || 500;
    }

    logger.error(`Error: ${message}`, { uuid, error: err });

    const response = ResponseFactory.error(message, statusCode);
    res.status(statusCode).json(response);
}
