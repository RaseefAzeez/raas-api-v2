// api-service/src/routes/operationRoutes.js
const express = require('express');
const router = express.Router();

// 1. Pull the custom interceptor middleware
const { checkPlatformPermissions } = require('../middleware/permissionMiddleware');

// 2. Pull the live BullMQ producer function we just created
const { addLifecycleTaskToQueue } = require('../queues/operationQueue');

/**
 * Route: POST /api/v2/execute
 * Description: Secure endpoint to trigger lifecycle actions on AWS EC2 assets.
 * Pipeline: Enforces authentication check via middleware before accepting payload.
 */
router.post('/execute', checkPlatformPermissions, async (req, res) => {
    try {
        const { action, instanceId } = req.body;
        const requestedBy = req.headers['x-user-email'] || 'anonymous-user@ust.com';

        console.log(`[ROUTE HANDLER]: Request cleared by security. Dispatching live payload...`);

        // Assemble the task packet exactly as needed for background execution
        const taskPayload = {
            action: action.toUpperCase(),
            instanceId,
            requestedBy,
            timestamp: new Date().toISOString()
        };

        // 3. Dispatch the payload straight into the Redis-backed BullMQ broker
        const job = await addLifecycleTaskToQueue(taskPayload);

        // 4. Return an instant, non-blocking 202 Accepted response to the client
        return res.status(202).json({
            success: true,
            message: `Execution request for action '${action}' on instance '${instanceId}' accepted and queued successfully.`,
            jobId: job.id // Provide the tracking job ID back to the client
        });

    } catch (error) {
        console.error(`[ROUTE LEVEL ERROR]: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while queuing your action payload."
        });
    }
});

module.exports = router;