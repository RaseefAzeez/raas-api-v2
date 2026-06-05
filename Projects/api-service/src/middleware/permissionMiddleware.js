// api-service/src/middleware/permissionMiddleware.js

/**
 * RaaS 2.0 Security Interceptor
 * Ports the RaaS 1.0 ABAC logic: Matches authenticated Cognito JWT groups 
 * against the specific resource tags of the target infrastructure.
 */
function checkPlatformPermissions(req, res, next) {
    try {
        // 1. Extract claims forwarded from your Cognito authentication layer
        // Locally, we inspect headers or fallback to a test request body
        const userGroups = req.headers['x-cognito-groups'] || req.body.userGroups || [];
        const { instanceId, instanceEnvironmentTag } = req.body;

        console.log(`\n[SECURITY INTERCEPTOR]: Evaluating access rules for instance: ${instanceId}`);
        console.log(`[SECURITY INTERCEPTOR]: User Cognito Groups:`, userGroups);

        if (!instanceId || !instanceEnvironmentTag) {
            return res.status(400).json({
                success: false,
                message: "Missing validation context: instanceId and instanceEnvironmentTag are required."
            });
        }

        // 2. RaaS 1.0 Core Matching Rule: 
        // Checks if the array of user groups contains the required environment tag string
        const hasAccess = userGroups.includes(instanceEnvironmentTag);

        if (!hasAccess) {
            console.warn(`[SECURITY REJECTION]: Access blocked! Groups do not match asset tag: ${instanceEnvironmentTag}`);
            return res.status(403).json({
                success: false,
                message: `Access Denied: Your privileges do not match the target asset environment tag (${instanceEnvironmentTag}).`
            });
        }

        // 3. Security Clearance Granted
        console.log(`[SECURITY CLEARANCE]: Tag match verified successfully. Forwarding request.`);
        next();

    } catch (error) {
        console.error(`[INTERCEPTOR CRITICAL ERROR]: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal Security Error occurred during operational access check."
        });
    }
}

module.exports = { checkPlatformPermissions };