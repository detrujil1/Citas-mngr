import { ServerConfiguration } from './config/server';
import { ServerRunner } from './infrastructure/bootstrap/server-runner';

const config = new ServerConfiguration();
const runner = new ServerRunner(config);

// Iniciar servidor
runner.run();

// Manejo de señales para shutdown graceful
process.on('SIGTERM', () => {
    runner.stop();
});

process.on('SIGINT', () => {
    runner.stop();
});
