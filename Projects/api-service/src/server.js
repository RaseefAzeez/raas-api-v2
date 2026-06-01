const express = require("express");
const app = express();

const controller = require("./controllers/operationController");
// Destructures the checkPlatformPermissions function from the exported middleware object
const { checkPlatformPermissions } = require("./middleware/permissionMiddleware");

app.use(express.json());

// Applies the security permission validation layer directly to the reboot routing endpoint
app.post("/reboot/:id", checkPlatformPermissions, (req, res) => {
    const response = controller.rebootInstance(req);

    if (response.status) {
        return res.status(response.status).json(response);
    }

    res.json(response);
});

app.get("/jobs", (req, res) => {
    const response = controller.getJobs();
    res.json(response);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});