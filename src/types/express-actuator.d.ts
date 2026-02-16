declare module 'express-actuator' {
    import { RequestHandler } from 'express';
    
    interface ActuatorOptions {
        basePath?: string;
        infoGitMode?: string;
        infoBuildOptions?: any;
        infoDateFormat?: string;
        infoDateFormatTimeZone?: string;
        customEndpoints?: any[];
    }
    
    function actuator(options?: ActuatorOptions): RequestHandler;
    
    export = actuator;
}
