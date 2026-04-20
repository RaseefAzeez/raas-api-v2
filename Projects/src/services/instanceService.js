const queue = [];
const completedJobs = [];

const RBAC_MAP = {
    "Devops-group": ["i-123", "i-456"],
    "Java-group": ["i-789"],
    "UI-group": ["i-999"]
};

function requestReboot(instanceId) {
    const job = {
        instance_id: instanceId,
        action: 'reboot',
        job_id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: 'queued'
    };

    queue.push(job);
    return job;
}

function getQueue() {
    return queue;
}

function getCompletedJobs() {
    return completedJobs;
}

function hasAccess(userGroups, instanceId) {
    return userGroups.some(group =>
        RBAC_MAP[group]?.includes(instanceId)
    );
}

module.exports = {
    requestReboot,
    getQueue,
    getCompletedJobs,
    hasAccess,
    queue,            //  (worker uses it)
    completedJobs     //  (worker uses it)
};