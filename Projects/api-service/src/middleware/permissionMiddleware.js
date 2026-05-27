// api-service/src/middleware/permissionMiddleware.js

// 1. Look outside this app container and pull the engine from the shared folder volume mapping
const { isAuthorized } = require('/usr/src/shared/rbac/access');

/**
 * Express Middleware to intercept network requests and run the shared RBAC logic.
 */
function checkPlatformPermissions(req, res, next) {
    try {
        // Pull Cognito group claims from request headers or body
        const userGroups = req.headers['x-cognito-groups'] || req.body.userGroups;
        const { instanceId } = req.body;

        console.log(`[API GATEWAY INTERCEPTOR]: Running security validation...`);

        // 2. Pass the data straight to the shared folder engine
        const hasAccess = isAuthorized(userGroups, instanceId);

        if (!hasAccess) {
            console.warn(`[SECURITY REJECTION]: Access blocked for instance ${instanceId}`);
            return res.status(403).json({
                success: false,
                message: "Access Denied: Your assigned Cognito group boundaries do not permit operations on this asset."
            });
        }

        // 3. Success! Move to the next step (the queue)
        console.log(`[SECURITY CLEARANCE]: Access verified. Forwarding request.`);
        next();

    } catch (error) {
        console.error(`[INTERCEPTOR ERROR]: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal Security Error occurred during permission verification."
        });
    }
}

module.exports = { checkPlatformPermissions };