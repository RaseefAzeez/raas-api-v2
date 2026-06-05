// shared/rbac/access.js
const groupMappings = require('./group');

/**
 * Evaluates if a user's security token groups are authorized to interact with a target resource ID.
 * @param {string|string[]} userGroups - Group or array of groups extracted from the Cognito token
 * @param {string} instanceId - Target AWS EC2 Instance ID here
 * @returns {boolean}
 */
function isAuthorized(userGroups, instanceId) {
    try {
        // Guardrail: Fail-closed if crucial validation inputs are missing
        if (!userGroups || !instanceId) {
            return false;
        }

        // Standardize into an array to cleanly handle both multi-group and single-group claims
        const groupsArray = Array.isArray(userGroups) ? userGroups : [userGroups];

        for (const group of groupsArray) {
            const cleanGroup = group.trim();

            // Rule 1: Super Admin Bypass (Devops-group gets immediate access)
            if (cleanGroup === 'Devops-group') {
                return true;
            }

            // Rule 2: Resource Boundary Verification
            const allowedInstances = groupMappings[cleanGroup];
            if (allowedInstances && allowedInstances.includes(instanceId)) {
                return true;
            }
        }

        // Enforce Default Deny (Principle of Least Privilege)
        return false;
    } catch (error) {
        console.error(`[RBAC ENGINE ERROR]: Validation crash: ${error.message}`);
        return false; // Always fail-closed on internal errors to maintain security
    }
}

module.exports = { isAuthorized };