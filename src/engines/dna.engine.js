class DNAEngine {
    static analyze(userInfo, tagCounts, metrics) {
        const totalTagsCount = Object.values(tagCounts).reduce((a, b) => a + b, 0);
        
        const getTagPercentage = (tagsList) => {
            let sum = 0;
            tagsList.forEach(t => { sum += (tagCounts[t] || 0); });
            return totalTagsCount > 0 ? (sum / totalTagsCount) * 100 : 0;
        };

        const mathTheoryTags = ['math', 'number theory', 'combinatorics', 'geometry', 'probabilities', 'games', 'matrices', 'chinese remainder theorem'];
        const implementationTags = ['implementation', 'brute force', 'sortings', 'strings', 'expression parsing'];
        const structTags = ['data structures', 'trees', 'dsu', 'fft', 'string suffix structures'];
        const graphSearchTags = ['graphs', 'dfs and similar', 'shortest paths', 'flows', 'graph matchings', '2-sat'];

        const mathPct = getTagPercentage(mathTheoryTags);
        const implPct = getTagPercentage(implementationTags);
        const structPct = getTagPercentage(structTags);
        const graphPct = getTagPercentage(graphSearchTags);
        const dpPct = getTagPercentage(['dp']);
        const greedyPct = getTagPercentage(['greedy']);

        let archetype = "The All-Rounder";

        if (mathPct >= 28) {
            archetype = "The Theorist";
        } else if (implPct >= 33) {
            archetype = "The Implementer";
        } else if (dpPct >= 18) {
            archetype = "The Dynamic Programmer";
        } else if (structPct >= 22) {
            archetype = "The Structurer";
        } else if (graphPct >= 20) {
            archetype = "The Navigator";
        } else if (greedyPct >= 18) {
            archetype = "The Opportunist";
        }

        const traits = [];
        if (metrics.accuracyRate >= 65) {
            traits.push("Sniper");
        } else if (metrics.accuracyRate > 0 && metrics.accuracyRate < 40) {
            traits.push("Brute-Force Debugger");
        }

        if (userInfo && userInfo.rating) {
            if (metrics.maxSolvedRating > userInfo.rating + 400) {
                traits.push("Giant Slayer");
            }
        } else if (metrics.maxSolvedRating >= 2600) {
            traits.push("Grandmaster Level Peak");
        }

        if (metrics.solvedProblems.size > 1500) {
            traits.push("Marathoner");
        } else if (metrics.solvedProblems.size > 0 && metrics.solvedProblems.size < 100) {
            traits.push("Explorer");
        }

        if (traits.length === 0) traits.push("Steady Progressor");

        return { archetype, traits };
    }
}

module.exports = DNAEngine;
