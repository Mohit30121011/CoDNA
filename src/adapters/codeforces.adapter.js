const axios = require("axios");

class CodeforcesAdapter {
    static async getUserInfo(handle) {
        try {
            const url = `https://codeforces.com/api/user.info?handles=${handle}`;
            const response = await axios.get(url);
            if (response.data.status === "OK") {
                return response.data.result[0];
            }
            return null;
        } catch (error) {
            console.error(`Error fetching user info for ${handle}:`, error.message);
            return null;
        }
    }

    static async getSubmissions(handle) {
        try {
            const url = `https://codeforces.com/api/user.status?handle=${handle}`;
            const response = await axios.get(url);
            if (response.data.status === "OK") {
                return response.data.result;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching submissions for ${handle}:`, error.message);
            return [];
        }
    }

    static async getProblemset() {
        try {
            const url = `https://codeforces.com/api/problemset.problems`;
            const response = await axios.get(url);
            if (response.data.status === "OK") {
                return response.data.result.problems;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching problemset:`, error.message);
            return [];
        }
    }
}

module.exports = CodeforcesAdapter;
