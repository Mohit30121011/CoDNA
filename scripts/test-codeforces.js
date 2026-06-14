console.log("CoDNA AI Started");
const axios = require("axios");
const url = "https://codeforces.com/api/user.info?handles=tourist";
axios.get(url)
    .then(response => {
        // console.log(response.data);
        const user = response.data.result[0];
        console.log("Handle: ", user.handle);
        console.log("Rating: ", user.rating);
        console.log("Max Rating: ", user.maxRating);
        console.log("Rank: ", user.rank);
    })
    .catch(error => {
        console.log(error);
    })
