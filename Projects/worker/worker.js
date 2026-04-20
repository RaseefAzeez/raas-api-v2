const { queue } = require("../src/services/instanceService");

function processQueue() {
    if (queue.length === 0) {
        console.log("No jobs in the queue. Waiting...");
        return;
    }

    const job = queue.shift();
    console.log(`Processing job: ${job.job_id}`);
    // Simulate job processing
    setTimeout(() => {
        console.log(`Job ${job.job_id} completed`);
    }, 1000);
}

setInterval(processQueue, 2000);