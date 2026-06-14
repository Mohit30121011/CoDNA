const express = require("express");
const AnalysisService = require("../services/analysis.service");

const router = express.Router();

router.get("/:handle", async (req, res) => {
    try {
        const handle = req.params.handle;
        const report = await AnalysisService.analyzeUser(handle);
        res.json(report);
    } catch (error) {
        console.error("Error in /analyze endpoint:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;
