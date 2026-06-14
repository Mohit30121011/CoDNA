const { formatTagName } = require("../utils/formatTag");

class CompareEngine {
    static analyze(user1Stats, user2Stats) {
        const handle1 = user1Stats.profile.handle;
        const handle2 = user2Stats.profile.handle;

        let score1 = 0;
        let score2 = 0;

        const categories = {};
        const edge1 = [];
        const edge2 = [];

        // Compare all tags from both users
        const allTags = new Set([
            ...Object.keys(user1Stats.topics.raw),
            ...Object.keys(user2Stats.topics.raw)
        ]);

        allTags.forEach(tag => {
            const count1 = user1Stats.topics.raw[tag] || 0;
            const count2 = user2Stats.topics.raw[tag] || 0;
            const formattedTag = formatTagName(tag);

            if (count1 > count2) {
                categories[tag] = handle1;
                score1++;
                if (count1 - count2 > 20) edge1.push(formattedTag);
            } else if (count2 > count1) {
                categories[tag] = handle2;
                score2++;
                if (count2 - count1 > 20) edge2.push(formattedTag);
            } else {
                categories[tag] = "tie";
            }
        });

        // Slice edges to top 5 most dominant
        const topEdge1 = edge1.slice(0, 5);
        const topEdge2 = edge2.slice(0, 5);

        let winner = "Tie";
        if (score1 > score2) winner = handle1;
        else if (score2 > score1) winner = handle2;

        let confidence = 0;
        if (score1 + score2 > 0) {
            confidence = Math.round((Math.max(score1, score2) / (score1 + score2)) * 100);
        }

        return {
            winner,
            confidence,
            score: {
                [handle1]: score1,
                [handle2]: score2
            },
            categories,
            edge: {
                [handle1]: topEdge1,
                [handle2]: topEdge2
            }
        };
    }
}

module.exports = CompareEngine;
