const axios = require("axios");

axios.get("https://codeforces.com/api/problemset.problems")
    .then(response => {
        console.log("Status:", response.data.status);
        console.log("Problems count:", response.data.result.problems.length);
        console.log("First problem sample:", response.data.result.problems[0]);
    })
    .catch(err => {
        console.error("Error:", err.message);
    });
