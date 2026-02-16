import mongoose from 'mongoose';
import { logger } from '../../../config/logger';
import env from '../../../config/env';

export class DatabaseConnection {
    private static instance: DatabaseConnection;

    private constructor() {}

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(env.database.MONGODB_URI);
            logger.info('Connected to MongoDB successfully', { uuid: 'DATABASE' });
        } catch (error) {
            logger.error('Failed to connect to MongoDB', { uuid: 'DATABASE', error });
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            logger.info('Disconnected from MongoDB', { uuid: 'DATABASE' });
        } catch (error) {
            logger.error('Error disconnecting from MongoDB', { uuid: 'DATABASE', error });
            throw error;
        }
    }

    public isConnected(): boolean {
        return mongoose.connection.readyState === 1;
    }
}
