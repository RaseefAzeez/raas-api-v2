// shared/rbac/groups.js

module.exports = {
    // 1. Super Admin: Granted absolute access to all infrastructure assets
    'Devops-group': ['*'],

    // 2. Resource Boundaries: Tied tightly to specific development tracks
    'Java-Developers': [
        'i-0123456789abcdef0',
        'i-0987654321fedcba0'
    ],

    'UI-Team': [
        'i-bcde1234567890fgh'
    ]
};