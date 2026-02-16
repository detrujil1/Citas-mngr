export interface IApiSuccessResponse {
    data: any;
    message?: string;
}

export interface IApiErrorResponse {
    error: string;
    statusCode: number;
    timestamp?: string;
}

export class ResponseFactory {
    static success(data: any, message?: string): IApiSuccessResponse {
        const response: IApiSuccessResponse = { data };
        if (message) {
            response.message = message;
        }
        return response;
    }

    static error(message: string, statusCode: number): IApiErrorResponse {
        return {
            error: message,
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }
}
