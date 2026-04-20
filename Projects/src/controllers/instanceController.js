const service = require('../services/instanceService');

function rebootInstance(req) {
    const instanceId = req.params.id;
    const userGroups = req.user?.groups || [];

    if (!instanceId) {
        return { status: 400, error: "Instance ID required" };
    }

    if (!service.hasAccess(userGroups, instanceId)) {
        return { status: 403, error: "Access denied" };
    }

    const job = service.requestReboot(instanceId);

    return {
        message: "Reboot request queued",
        job
    };
}

function getJobs() {
    return {
        queued: service.getQueue(),
        completed: service.getCompletedJobs()
    };
}

module.exports = {
    rebootInstance,
    getJobs
};