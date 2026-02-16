import { Request, Response, NextFunction } from 'express';

export function validateRequestHeaders(
    _req: Request,
    _res: Response,
    next: NextFunction
): void {
    // X-RqUID is now optional, just pass through
    next();
}

export function validateRequestBody(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const contentType = req.headers['content-type'];
    
    if (req.method !== 'GET' && req.method !== 'DELETE') {
        if (!contentType || !contentType.includes('application/json')) {
            res.status(400).json({
                error: 'Content-Type must be application/json',
                statusCode: 400,
            });
            return;
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({
                error: 'Request body is required',
                statusCode: 400,
            });
            return;
        }
    }

    next();
}
