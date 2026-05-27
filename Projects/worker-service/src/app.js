// worker-service/src/app.js

console.log(`========================================================`);
console.log(`⚙️ RaaS v2 ASYNCHRONOUS WORKER ENGINE IS INITIALIZING...`);
console.log(`========================================================`);

// 1. Import the live BullMQ consumer worker we just created
// This instantly activates the listening loop on the Redis queue channel
const { operationWorker } = require('./workers/operationWorker');

// Pull critical environment variables from the container runtime
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

console.log(`[CONFIG]: Target Message Broker: redis://${REDIS_HOST}:${REDIS_PORT}`);
console.log(`[CONFIG]: Targeted Cloud Region: ${AWS_REGION}`);
console.log(`[WORKER STATUS]: Active and listening to 'operation-queue' channel on Redis...`);

// 2. Handle graceful shutdowns (Crucial for Docker/Kubernetes container lifecycles)
process.on('SIGTERM', async () => {
    console.log(`[SHUTDOWN] SIGTERM signal received. Cleansing worker connection states...`);
    // Gracefully close the BullMQ worker connection before shutting down the container
    await operationWorker.close();
    console.log(`[SHUTDOWN] Worker connections drained safely.`);
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log(`[SHUTDOWN] SIGINT signal received. Terminating process loops...`);
    await operationWorker.close();
    process.exit(0);
});