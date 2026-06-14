class DNAEngine {
    static analyze(userInfo, tagCounts, metrics, contestHistory) {
        const totalTagsCount = Object.values(tagCounts).reduce((a, b) => a + b, 0);
        
        const getTagPercentage = (tagsList) => {
            let sum = 0;
            tagsList.forEach(t => { sum += (tagCounts[t] || 0); });
            return totalTagsCount > 0 ? (sum / totalTagsCount) * 100 : 0;
        };

        const mathTheoryTags = ['math', 'number theory', 'combinatorics', 'geometry', 'probabilities', 'games', 'matrices', 'chinese remainder theorem'];
        const structTags = ['data structures', 'trees', 'dsu', 'fft', 'string suffix structures'];
        const graphSearchTags = ['graphs', 'dfs and similar', 'shortest paths', 'flows', 'graph matchings', '2-sat'];

        const mathPct = getTagPercentage(mathTheoryTags);
        const structPct = getTagPercentage(structTags);
        const graphPct = getTagPercentage(graphSearchTags);
        const dpPct = getTagPercentage(['dp']);
        const greedyPct = getTagPercentage(['greedy']);

        const candidateArchetypes = [];

        if (metrics.solvedProblems.size >= 2500) {
            candidateArchetypes.push("The Marathon Grinder");
        }
        if (contestHistory && contestHistory.length > 100) {
            candidateArchetypes.push("The Competitor");
        }
        if (dpPct >= 20 && greedyPct >= 15) {
            candidateArchetypes.push("The Algorithmist");
        }
        if (graphPct >= 20) {
            candidateArchetypes.push("The Graph Wizard");
        }
        if (mathPct >= 25) {
            candidateArchetypes.push("The Theorist");
        }
        if (metrics.accuracyRate >= 70) {
            candidateArchetypes.push("The Speed Demon");
        }
        if (structPct >= 22) {
            candidateArchetypes.push("The Specialist");
        }

        if (candidateArchetypes.length === 0) {
            candidateArchetypes.push("The Problem Hunter");
        }

        const primaryArchetype = candidateArchetypes[0];
        const secondaryArchetypes = candidateArchetypes.slice(1);

        // Determine Traits
        const traits = [];
        if (mathPct >= 20) traits.push("Theorist");
        if (graphPct >= 15) traits.push("Graph Specialist");
        if (dpPct >= 15) traits.push("DP Wizard");
        if (structPct >= 18) traits.push("Structurer");

        if (metrics.accuracyRate >= 65) traits.push("Sniper");
        else if (metrics.accuracyRate > 0 && metrics.accuracyRate < 40) traits.push("Brute-Force Debugger");

        if (userInfo && userInfo.rating && metrics.maxSolvedRating > userInfo.rating + 400) {
            traits.push("Giant Slayer");
        }

        if (metrics.solvedProblems.size > 1500) traits.push("Marathoner");
        else if (metrics.solvedProblems.size > 0 && metrics.solvedProblems.size < 200) traits.push("Explorer");

        if (contestHistory && contestHistory.length >= 200) {
            traits.push("Veteran");
        }

        if (traits.length === 0) traits.push("Steady Progressor");

        return { primaryArchetype, secondaryArchetypes, traits };
    }
}

module.exports = DNAEngine;
