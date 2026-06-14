const express = require("express");
const cors = require("cors");
const config = require("./config");
const analysisRoutes = require("./routes/analysis.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/analyze", analysisRoutes);

app.listen(config.PORT, () => {
    console.log(`CoDNA AI MVP Server is running on port ${config.PORT}`);
});
