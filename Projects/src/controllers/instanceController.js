const service = require('../services/instanceService');

function rebootInstance(req) {
    const instanceId = req.params.id;

    const job = service.requestReboot(instanceId);
    return {
        message: "Reboot request queued",
        job: job
    };
}

function getJobs() {
    return {
        queued: service.queue,
        completed: service.completedJobs
    };
}

module.exports = {
    rebootInstance,
    getJobs
};