console.log("CoDNA AI Started");
const axios = require("axios");
const url = "https://codeforces.com/api/user.rating?handle=tourist";
axios.get(url)
    .then(response => {
        const contests = response.data.result;
        const firstContest = contests[0];
        const latestContest = contests[contests.length - 1];

  console.log("First Contest Name:", firstContest.contestName);
console.log("First Contest Rank:", firstContest.rank);

console.log("Latest Contest Name:", latestContest.contestName);
console.log("Latest Contest Rank:", latestContest.rank);
console.log("Latest Contest Old Rating:", latestContest.oldRating);
console.log("Latest Contest New Rating:", latestContest.newRating);

console.log("Total Contests:", contests.length);
        console.log("Total Contests:", response.data.result.length);

    })
    .catch(error => {
        console.log(error);
    })
