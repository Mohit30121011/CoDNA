const { formatTagName } = require("../utils/formatTag");

class BenchmarkEngine {
    static compare(metrics1, info1, metrics2, info2) {
        return {
            user1: {
                handle: info1 ? info1.handle : "User1",
                rating: info1 ? (info1.rating || 0) : 0,
                maxRating: info1 ? (info1.maxRating || 0) : 0,
                solvedCount: metrics1.solvedProblems.size,
                accuracy: metrics1.accuracyRate,
                avgDifficulty: metrics1.avgSolvedRating,
                topTags: Object.entries(metrics1.tagCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([tag, count]) => `${formatTagName(tag)} (${count})`)
            },
            user2: {
                handle: info2 ? info2.handle : "User2",
                rating: info2 ? (info2.rating || 0) : 0,
                maxRating: info2 ? (info2.maxRating || 0) : 0,
                solvedCount: metrics2.solvedProblems.size,
                accuracy: metrics2.accuracyRate,
                avgDifficulty: metrics2.avgSolvedRating,
                topTags: Object.entries(metrics2.tagCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([tag, count]) => `${formatTagName(tag)} (${count})`)
            }
        };
    }
}

module.exports = BenchmarkEngine;
