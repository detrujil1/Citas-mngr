import express, { Express } from 'express';
import actuator from 'express-actuator';
import morgan from 'morgan';
import { logger } from './logger';
import { sendErrorResponse } from '../infrastructure/adapter/http/error-handler';
import env from './env';
import userRouter from '../adapter/route/user/user-route-configuration';
import specialtyRouter from '../adapter/route/specialty/specialty-route-configuration';
import doctorRouter from '../adapter/route/doctor/doctor-route-configuration';
import appointmentRouter from '../adapter/route/appointment/appointment-route-configuration';

export class ServerConfiguration {
    private readonly _app: Express;
    private readonly _apiBasePath: string;

    constructor() {
        this._app = express();
        this._apiBasePath = env.serverConfig.API_BASE_PATH;
        this.configure();
    }

    private configure(): void {
        this.setupRequestLogging();
        this.setupParsers();
        this.setupCorsHeaders();
        this.setupRoutes();
        this.setupErrorHandler();
    }

    private setupRequestLogging(): void {
        this._app.use(
            morgan('combined', {
                skip: (req) => req.path === '/management/health',
                stream: {
                    write: (message) => logger.info(message.trim(), { uuid: 'N/A' }),
                },
            })
        );
    }

    private setupParsers(): void {
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: false }));
    }

    private setupCorsHeaders(): void {
        const allowedOrigins = env.serverConfig.ALLOWED_ORIGINS
            .split(',')
            .map(origin => origin.trim());

        this._app.use((req, res, next): void => {
            const origin = req.headers.origin;

            if (origin && allowedOrigins.includes(origin)) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }

            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-RqUID');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
                return;
            }

            next();
        });
    }

    private setupRoutes(): void {
        this._app.use(
            actuator({
                basePath: '/management',
            })
        );

        logger.info('API path: ' + this._apiBasePath, { uuid: 'N/A' });

        this._app.use(this._apiBasePath, userRouter);
        this._app.use(this._apiBasePath, specialtyRouter);
        this._app.use(this._apiBasePath, doctorRouter);
        this._app.use(this._apiBasePath, appointmentRouter);
    }

    private setupErrorHandler(): void {
        this._app.use(sendErrorResponse);
    }

    public get app(): Express {
        return this._app;
    }
}
