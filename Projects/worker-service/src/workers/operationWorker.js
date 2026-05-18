const AWS = require("aws-sdk");

const ec2 = new AWS.EC2({
    region: "us-east-1"
});

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

    ec2.rebootInstances({
        InstanceIds: [job.instance_id]
    }, (err, data) => {

        if (err) {
            job.status = 'failed';
            console.log("Error rebooting instance:", err);
        } else {
            job.status = 'completed';
            completedJobs.push(job);
            console.log(`Reboot triggered for ${job.instance_id}`);
        }

    });
}

setInterval(processQueue, 2000);

