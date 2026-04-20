const AWS = require("aws-sdk");

const { queue, completedJobs } = require("../src/services/instanceService");

function processQueue() {
    if (queue.length === 0) {
        console.log("No jobs in the queue. Waiting...");
        return;
    }

    const job = queue.shift();
    job.status = 'processing';
    console.log(`Processing job: ${job.job_id}`);
    // Simulate job processing
    setTimeout(() => {
        job.status = 'completed';
        completedJobs.push(job);
        console.log(`Job ${job.job_id} completed`);
    }, 1000);
}

setInterval(processQueue, 2000);

