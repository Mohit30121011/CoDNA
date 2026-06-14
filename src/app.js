const express = require("express");
const cors = require("cors");
const config = require("./config");
const analysisRoutes = require("./routes/analysis.routes");
const compareRoutes = require("./routes/compare.routes");
const benchmarkRoutes = require("./routes/benchmark.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/analyze", analysisRoutes);
app.use("/compare", compareRoutes);
app.use("/benchmark", benchmarkRoutes);

app.listen(config.PORT, () => {
    console.log(`CoDNA AI MVP Server is running on port ${config.PORT}`);
});
