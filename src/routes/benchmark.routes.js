const express = require('express');
const router = express.Router();
const BenchmarkService = require('../services/benchmark.service');

router.get('/:handle', async (req, res) => {
    try {
        const handle = req.params.handle;
        const benchmark = await BenchmarkService.getBenchmark(handle);
        res.json(benchmark);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate benchmark", details: error.message });
    }
});

module.exports = router;
