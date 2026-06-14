const express = require("express");
const CompareService = require("../services/compare.service");

const router = express.Router();

router.get("/:handle1/:handle2", async (req, res) => {
    try {
        const { handle1, handle2 } = req.params;
        const report = await CompareService.compareUsers(handle1, handle2);
        res.json(report);
    } catch (error) {
        console.error("Error in /compare endpoint:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;
