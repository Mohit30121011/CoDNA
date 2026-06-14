const { formatTagName } = require("../utils/formatTag");

class RecommendationEngine {
    static generate(userInfo, tagCounts, solvedProblems, allProblems) {
        const COMMON_TAGS = [
            'dp', 'greedy', 'math', 'data structures', 'graphs', 
            'trees', 'binary search', 'sortings', 'brute force', 
            'implementation', 'strings', 'two pointers', 'dfs and similar'
        ];

        const userRating = userInfo ? (userInfo.rating || 1200) : 1200;
        const targetMin = Math.max(800, Math.min(userRating - 100, 3300));
        const targetMax = Math.max(800, Math.min(userRating + 200, 3500));

        const commonTagStatus = COMMON_TAGS.map(tag => ({
            tag,
            count: tagCounts[tag] || 0
        })).sort((a, b) => a.count - b.count);

        const focusTags = commonTagStatus.slice(0, 3).map(item => item.tag);
        
        const recommendations = [];
        const sortedProblems = [...allProblems].sort((a, b) => b.contestId - a.contestId);

        for (const problem of sortedProblems) {
            if (!problem.rating || problem.rating < targetMin || problem.rating > targetMax) {
                continue;
            }

            const problemId = problem.contestId && problem.index 
                ? `${problem.contestId}-${problem.index}` 
                : problem.name;

            if (solvedProblems.has(problemId)) continue;

            const matchesFocusTag = (problem.tags || []).some(tag => focusTags.includes(tag));
            if (matchesFocusTag) {
                recommendations.push({
                    id: `${problem.contestId}${problem.index}`,
                    name: problem.name,
                    rating: problem.rating,
                    tags: problem.tags.map(formatTagName),
                    url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
                });
                if (recommendations.length >= 5) break;
            }
        }

        return recommendations;
    }
}

module.exports = RecommendationEngine;
