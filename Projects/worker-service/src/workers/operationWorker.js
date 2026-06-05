// worker-service/src/workers/operationWorker.js
const { Worker } = require('bullmq');

// Pull Redis connection parameters from environment variables
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

/**
 * 1. Initialize the BullMQ Worker Engine.
 */
const operationWorker = new Worker('operation-queue', async (job) => {
    const { action, instanceId, requestedBy } = job.data;

    console.log(`\n[WORKER PROCESSING] 🟢 Job Received! ID: ${job.id}`);
    console.log(` -> Action: ${action}`);
    console.log(` -> Target Asset: ${instanceId}`);
    console.log(` -> Authorized By: ${requestedBy}`);

    try {
        // 2. Simulate execution of AWS SDK client actions
        switch (action) {
            case 'START':
                console.log(`[AWS SDK CALL]: ec2Client.send(new StartInstancesCommand({ InstanceIds: ['${instanceId}'] }))`);
                console.log(`[STATUS CHANGE]: Asset ${instanceId} state changed to 'RUNNING'.`);
                break;

            case 'STOP':
                console.log(`[AWS SDK CALL]: ec2Client.send(new StopInstancesCommand({ InstanceIds: ['${instanceId}'] }))`);
                console.log(`[STATUS CHANGE]: Asset ${instanceId} state changed to 'STOPPED'.`);
                break;

            case 'REBOOT':
                console.log(
                    `[SAFE MODE] Would reboot instance ${instanceId}`
                );
                break;

            default:
                throw new Error(`Unsupported lifecycle action: '${action}'.`);
        }

        console.log(`[WORKER SUCCESS] ✅ Job ID ${job.id} processed successfully.`);
        return { success: true, target: instanceId };

    } catch (error) {
        console.error(`[WORKER CORE ERROR]: Processing failed for Job ID ${job.id}: ${error.message}`);
        throw error;
    }
}, {
    connection: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT, 10)
    },
    concurrency: 5
});

module.exports = { operationWorker };