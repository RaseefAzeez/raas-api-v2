const { Queue } = require("bullmq");

const operationQueue = new Queue("operation-queue", {
    connection: {
        host: process.env.REDIS_HOST || "raas-redis-service",
        port: parseInt(process.env.REDIS_PORT || "6379", 10)
    }
});

module.exports = { operationQueue };