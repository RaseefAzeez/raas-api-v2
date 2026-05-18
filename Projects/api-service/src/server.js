const express = require("express");
const app = express();

const controller = require("./src/controllers/instanceController");
const authMiddleware = require("./src/middleware/authMiddleware");

// Middleware
function authMiddleware(req, res, next) {
    // TEMP: simulate decoded JWT
    req.user = {
        sub: "test-user",
        groups: ["Devops-group"]
    };

    next();
}

module.exports = authMiddleware;

app.use(express.json());

// Protected route (RBAC + JWT)
app.post("/reboot/:id", authMiddleware, (req, res) => {
    const response = controller.rebootInstance(req);

    if (response.status) {
        return res.status(response.status).json(response);
    }

    res.json(response);
});

// Public route (or protect later if needed)
app.get("/jobs", (req, res) => {
    const response = controller.getJobs();
    res.json(response);
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});