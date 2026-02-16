import { Request } from 'express';

export interface ICustomRequest extends Request {
    headers: {
        'x-rquid'?: string;
        authorization?: string;
        [key: string]: any;
    };
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

export type IRequest = ICustomRequest;
