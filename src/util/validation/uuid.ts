import { validate as uuidValidate } from 'uuid';
import { ICustomRequest } from '../../infrastructure/adapter/http/header';

export function validateUUID(req: ICustomRequest): string {
    const uuid = req.headers['x-rquid'];
    
    if (!uuid || !uuidValidate(uuid)) {
        throw new Error('Invalid or missing X-RqUID header');
    }
    
    return uuid;
}
