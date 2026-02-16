import http from 'http';
import { logger } from '../../config/logger';
import { ServerConfiguration } from '../../config/server';
import { DatabaseConnection } from '../persistence/mongodb/database-connection';
import env from '../../config/env';

export class ServerRunner {
    private readonly server: http.Server;
    private readonly port: number | string;
    private readonly dbConnection: DatabaseConnection;

    constructor(private readonly config: ServerConfiguration) {
        this.port = this.normalizePort(env.serverConfig.PORT);
        this.config.app.set('port', this.port);
        this.server = http.createServer(this.config.app);
        this.dbConnection = DatabaseConnection.getInstance();
    }

    public async run(): Promise<void> {
        const uuid: string = 'BOOTSTRAP';
        
        try {
            // Conectar a la base de datos
            await this.dbConnection.connect();
            logger.info('Database connected successfully', { uuid });

            // Iniciar servidor
            this.server.listen(this.port);
            this.server.on('error', this.onError.bind(this));
            this.server.on('listening', this.onListening.bind(this, uuid));
            logger.info(`Server started on port: ${this.port}`, { uuid });
        } catch (error) {
            logger.error('Failed to start server', { uuid, error });
            process.exit(1);
        }
    }

    private normalizePort(val: string): string | number {
        const nPort = parseInt(val, 10);
        if (isNaN(nPort)) return val;
        if (nPort >= 0) return nPort;
        return 3000;
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') throw error;
        const uuid: string = 'BOOTSTRAP';
        const bind = typeof this.port === 'string'
            ? `Pipe ${this.port}`
            : `Port ${this.port}`;

        switch (error.code) {
            case 'EACCES':
                logger.error(`${bind} requires elevated privileges`, { uuid });
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(`${bind} is already in use`, { uuid });
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private onListening(uuid: string): void {
        const addr = this.server.address();
        const bind = typeof addr === 'string'
            ? `pipe ${addr}`
            : `port ${(addr as any)?.port}`;
        logger.warn(`Listening on: ${bind}`, { uuid });
    }

    public async stop(): Promise<void> {
        const uuid: string = 'BOOTSTRAP';
        logger.info('Shutting down server...', { uuid });
        
        await this.dbConnection.disconnect();
        
        this.server.close(() => {
            logger.info('Server closed', { uuid });
            process.exit(0);
        });
    }
}
