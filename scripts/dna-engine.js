const axios = require("axios");

const handle = process.argv[2];
if (!handle) {
    console.error("Please provide a Codeforces handle. Example: node scripts/dna-engine.js tourist");
    process.exit(1);
}

const infoUrl = `https://codeforces.com/api/user.info?handles=${handle}`;
const statusUrl = `https://codeforces.com/api/user.status?handle=${handle}`;

async function main() {
    try {
        console.log(`Analyzing DNA for ${handle.toUpperCase()}... Please wait...`);
        
        const [infoRes, statusRes] = await Promise.all([
            axios.get(infoUrl).catch(() => null),
            axios.get(statusUrl)
        ]);

        if (statusRes.data.status !== "OK") {
            console.error("Failed to fetch submission data:", statusRes.data.comment);
            return;
        }

        const userInfo = infoRes && infoRes.data.status === "OK" ? infoRes.data.result[0] : null;
        const submissions = statusRes.data.result;

        const solvedProblems = new Set();
        const tagCounts = {};
        let totalRating = 0;
        let ratedCount = 0;
        let maxSolvedRating = 0;
        let totalOK = 0;

        submissions.forEach(sub => {
            if (sub.verdict === "OK") {
                totalOK++;
                const problem = sub.problem;
                const problemId = problem.contestId && problem.index 
                    ? `${problem.contestId}-${problem.index}` 
                    : problem.name;

                if (!solvedProblems.has(problemId)) {
                    solvedProblems.add(problemId);
                    
                    if (problem.rating) {
                        totalRating += problem.rating;
                        ratedCount++;
                        if (problem.rating > maxSolvedRating) {
                            maxSolvedRating = problem.rating;
                        }
                    }

                    const tags = problem.tags || [];
                    tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                }
            }
        });

        if (solvedProblems.size === 0) {
            console.log("No solved problems found to compute DNA profile.");
            return;
        }

        // Calculate metrics
        const totalSubmissions = submissions.length;
        const accuracyRate = totalSubmissions > 0 ? (totalOK / totalSubmissions) * 100 : 0;
        const avgSolvedRating = ratedCount > 0 ? Math.round(totalRating / ratedCount) : 0;

        // Group tags for Archetypes
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

        // Determine Archetype
        let archetype = "The All-Rounder";
        let description = "Balanced problem solver with a diverse set of skills across topics.";

        if (mathPct >= 28) {
            archetype = "The Theorist";
            description = "Deep thinker who excels in mathematical concepts, number theory, and combinatorics.";
        } else if (implPct >= 33) {
            archetype = "The Implementer";
            description = "A rapid coder who excels at turning complex logic and brute-force simulations into bug-free code.";
        } else if (dpPct >= 18) {
            archetype = "The Dynamic Programmer";
            description = "Master of breaking down complex problems into subproblems and optimizing with state memory.";
        } else if (structPct >= 22) {
            archetype = "The Structurer";
            description = "Advanced coder specialized in trees, segment trees, DSU, and advanced data structures.";
        } else if (graphPct >= 20) {
            archetype = "The Navigator (Graph Specialist)";
            description = "Expert in traversing networks, trees, and finding shortest paths through complex graphs.";
        } else if (greedyPct >= 18) {
            archetype = "The Opportunist (Greedy Solver)";
            description = "Expert at making locally optimal choices at each stage with a strong intuition for greedy strategies.";
        }

        // Determine personality traits
        const traits = [];
        // Accuracy trait
        if (accuracyRate >= 65) {
            traits.push("Sniper (High accuracy / low submission overhead)");
        } else if (accuracyRate < 40) {
            traits.push("Brute-Force Debugger (High iteration rate)");
        }

        // Difficulty delta vs current rating (if we have current rating)
        if (userInfo && userInfo.rating) {
            if (maxSolvedRating > userInfo.rating + 400) {
                traits.push("Giant Slayer (Regularly Solves +400 above current level)");
            }
        } else if (maxSolvedRating >= 2600) {
            traits.push("Grandmaster Level Peak");
        }

        // Volume trait
        if (solvedProblems.size > 1500) {
            traits.push("Marathoner (Huge volume of unique problems solved)");
        } else if (solvedProblems.size < 100) {
            traits.push("Explorer (Starting their competitive programming journey)");
        }

        // output results
        console.log("\n==================================================");
        console.log(`   🧬 CoDNA PROFILE FOR ${handle.toUpperCase()} 🧬`);
        console.log("==================================================");
        if (userInfo) {
            console.log(`Rank:         ${userInfo.rank || "N/A"} (Max: ${userInfo.maxRank || "N/A"})`);
            console.log(`Rating:       ${userInfo.rating || 0} (Max: ${userInfo.maxRating || 0})`);
        }
        console.log(`Solved (Unique): ${solvedProblems.size}`);
        console.log(`Accuracy:     ${accuracyRate.toFixed(1)}% (OK/Total ratio)`);
        if (avgSolvedRating > 0) {
            console.log(`Avg Difficulty: ${avgSolvedRating} (Max Solved: ${maxSolvedRating})`);
        }
        console.log("--------------------------------------------------");
        console.log(`ARCHETYPE:    ${archetype}`);
        console.log(`Description:  ${description}`);
        console.log("--------------------------------------------------");
        console.log("SPECIAL TRAITS:");
        if (traits.length > 0) {
            traits.forEach(t => console.log(`  * ${t}`));
        } else {
            console.log("  * Steady Progressor");
        }
        console.log("==================================================\n");

    } catch (error) {
        console.error("Error executing DNA analysis:", error.message);
    }
}

main();
