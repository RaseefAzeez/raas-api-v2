const express = require("express");
const app = express();

const controller = require("./src/controllers/instanceController");

// Middleware
app.use(express.json());

// Route to create job
app.post("/reboot/:id", (req, res) => {
    const response = controller.rebootInstance(req);
    res.json(response);
});

// Route to view jobs
app.get("/jobs", (req, res) => {
    const response = controller.getJobs();
    res.json(response);
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});