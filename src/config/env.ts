import dotenv from 'dotenv';

dotenv.config();

interface IEnvConfig {
    serverConfig: {
        PORT: string;
        API_BASE_PATH: string;
        ALLOWED_ORIGINS: string;
    };
    database: {
        MONGODB_URI: string;
        MONGODB_NAME: string;
    };
    jwt: {
        JWT_SECRET: string;
        JWT_EXPIRATION: string;
    };
    logger: {
        LOG_LEVEL: string;
    };
}

const env: IEnvConfig = {
    serverConfig: {
        PORT: process.env.PORT || '3000',
        API_BASE_PATH: process.env.API_BASE_PATH || '/api/v1',
        ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
    },
    database: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/citas-db',
        MONGODB_NAME: process.env.MONGODB_NAME || 'citas-db',
    },
    jwt: {
        JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this',
        JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
    },
    logger: {
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    },
};

export default env;
