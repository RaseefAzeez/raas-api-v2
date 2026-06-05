// api-service/src/controllers/operationController.js

// Local state array to track jobs for your /jobs endpoint during testing
const localJobHistory = [];
const { operationQueue } = require("../services/queueService");

async function rebootInstance(req) {
    const { instanceId, instanceEnvironmentTag } = req.body;

    console.log(`[API CONTROLLER]: Queueing reboot job into Redis broker for: ${instanceId}`);

    const newJob = {
        jobId: `job-${Date.now()}`,
        instanceId: instanceId,
        environment: instanceEnvironmentTag,
        status: "queued",
        timestamp: new Date().toISOString()
    };

    // Store in historical record array
    localJobHistory.push(newJob);

    await operationQueue.add("reboot", {
        action: "REBOOT",
        instanceId,
        requestedBy: "test-user"
    });

    // 💡 LIVE RUNTIME INTEGRATION: This is where we trigger your BullMQ queue worker hook:
    // await rebootQueue.add(newJob);

    return {
        success: true,
        message: `Reboot task safely authorized and placed into the background processing queue.`,
        job: newJob
    };
}

function getJobs() {
    return {
        queued: localJobHistory.filter(j => j.status === "queued"),
        completed: localJobHistory.filter(j => j.status === "completed")
    };
}

module.exports = {
    rebootInstance,
    getJobs
};