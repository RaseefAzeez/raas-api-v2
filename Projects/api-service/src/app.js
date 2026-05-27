// api-service/src/app.js
const express = require('express');
const app = express();

// 1. Import your newly built operation route paths
const operationRoutes = require('./routes/operationRoutes');

// 2. Global Middleware: Enable the application to parse JSON request bodies
app.use(express.json());

// 3. Health Check Endpoint: Critical for Docker and Kubernetes orchestration checks
app.get('/health', (req, res) => {
    return res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
        service: "raas-api-service"
    });
});

// 4. Mount your secure operational routes onto the API routing tree
app.use('/api/v2', operationRoutes);

// 5. Establish an error fallback catcher to prevent container crashes from unhandled errors
app.use((err, req, res, next) => {
    console.error(`[GLOBAL UNCAUGHT ERROR]: ${err.stack}`);
    res.status(500).json({
        success: false,
        message: "An unexpected error occurred at the gateway level."
    });
});

// 6. Bind the service to its environmental runtime port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`🚀 RaaS v2 API GATEWAY IS ONLINE AND RUNNING ON PORT ${PORT}`);
    console.log(`========================================================`);
});

module.exports = app;