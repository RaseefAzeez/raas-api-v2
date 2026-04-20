const service = require('../services/InstanceService');

function rebootInstance(req) {
    const instanceId = req.params.id;

    const job = service.rebootInstance(instanceId);
    return job;
}
