const axios = require("axios");

class CodeforcesAdapter {
    static lastRequestTime = 0;
    static DELAY_MS = 1500;

    static async requestWithDelay(url) {
        const now = Date.now();
        const timeSinceLast = now - CodeforcesAdapter.lastRequestTime;
        if (timeSinceLast < CodeforcesAdapter.DELAY_MS) {
            await new Promise(resolve => setTimeout(resolve, CodeforcesAdapter.DELAY_MS - timeSinceLast));
        }
        CodeforcesAdapter.lastRequestTime = Date.now();
        return axios.get(url);
    }

    static async getActiveUsers() {
        try {
            const url = `https://codeforces.com/api/user.ratedList?activeOnly=true`;
            const response = await CodeforcesAdapter.requestWithDelay(url);
            if (response.data.status === "OK") {
                return response.data.result;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching active users:`, error.message);
            return [];
        }
    }

    static async getUserInfo(handle) {
        try {
            const url = `https://codeforces.com/api/user.info?handles=${handle}`;
            const response = await CodeforcesAdapter.requestWithDelay(url);
            if (response.data.status === "OK") {
                return response.data.result[0];
            }
            return null;
        } catch (error) {
            console.error(`Error fetching user info for ${handle}:`, error.message);
            return null;
        }
    }

    static async getContestHistory(handle) {
        try {
            const url = `https://codeforces.com/api/user.rating?handle=${handle}`;
            const response = await CodeforcesAdapter.requestWithDelay(url);
            if (response.data.status === "OK") {
                return response.data.result;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching contest history for ${handle}:`, error.message);
            return [];
        }
    }

    static async getSubmissions(handle) {
        try {
            const url = `https://codeforces.com/api/user.status?handle=${handle}`;
            const response = await CodeforcesAdapter.requestWithDelay(url);
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
            const response = await CodeforcesAdapter.requestWithDelay(url);
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
