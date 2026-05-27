// api-service/src/queues/operationQueue.js
const { Queue } = require('bullmq');

// Pull Redis connection parameters from environment variables
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

/**
 * 1. Initialize the BullMQ Queue.
 * This establishes a connection to Redis under a specific channel name ('operation-queue').
 */
const operationQueue = new Queue('operation-queue', {
    connection: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT, 10)
    }
});

/**
 * Helper function to push an authorized lifecycle action into the Redis queue.
 * @param {Object} taskData - Contains action, instanceId, and requestedBy
 */
async function addLifecycleTaskToQueue(taskData) {
    try {
        console.log(`[QUEUE PRODUCER]: Connecting to Redis broker to dispatch task...`);

        // 2. Add the job to the queue with a descriptive name ('lifecycle-job')
        // We set backoff rules to automatically retry if things fail temporarily
        const job = await operationQueue.add('lifecycle-job', taskData, {
            attempts: 3, // Retry up to 3 times if the worker fails
            backoff: {
                type: 'exponential',
                delay: 5000 // Wait 5s, then 10s, then 20s between retries
            },
            removeOnComplete: true, // Clean up data after success to keep Redis memory thin
            removeOnFail: false    // Keep failures in the history log for debugging
        });

        console.log(`[QUEUE PRODUCER SUCCESS]: Task successfully enqueued! Job ID assigned: ${job.id}`);
        return job;

    } catch (error) {
        console.error(`[QUEUE PRODUCER CRITICAL ERROR]: Failed to push to Redis: ${error.message}`);
        throw new Error('Message Broker unavailable. Failed to secure operational task placement.');
    }
}

module.exports = { addLifecycleTaskToQueue };