const queue = [];
const completedJobs = [];

function requestReboot(instanceId) {
    const job = {
        instance_id: instanceId,
        action: 'reboot',
        job_id: Date.now(),
        status: 'queued'
    };
    queue.push(job);
    return job;
}

function getQueue() {
    return queue;
}

module.exports = {
    requestReboot,
    getQueue,
    queue

};