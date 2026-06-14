const axios = require("axios");

const handle = process.argv[2];
if (!handle) {
    console.error("Please provide a Codeforces handle. Example: node scripts/recommendation-engine.js tourist");
    process.exit(1);
}

const infoUrl = `https://codeforces.com/api/user.info?handles=${handle}`;
const statusUrl = `https://codeforces.com/api/user.status?handle=${handle}`;
const problemsetUrl = `https://codeforces.com/api/problemset.problems`;

const COMMON_TAGS = [
    'dp', 'greedy', 'math', 'data structures', 'graphs', 
    'trees', 'binary search', 'sortings', 'brute force', 
    'implementation', 'strings', 'two pointers', 'dfs and similar'
];

function formatTagName(tag) {
    if (tag === 'dp') return 'DP';
    if (tag === 'dsu') return 'DSU';
    if (tag === 'fft') return 'FFT';
    if (tag === '2-sat') return '2-SAT';
    return tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function main() {
    try {
        console.log(`Generating Recommendations for ${handle.toUpperCase()}... Please wait...\n`);

        const [infoRes, statusRes, problemsetRes] = await Promise.all([
            axios.get(infoUrl).catch(() => null),
            axios.get(statusUrl),
            axios.get(problemsetUrl)
        ]);

        if (statusRes.data.status !== "OK") {
            console.error("Failed to fetch user submissions:", statusRes.data.comment);
            return;
        }
        if (problemsetRes.data.status !== "OK") {
            console.error("Failed to fetch Codeforces problemset:", problemsetRes.data.comment);
            return;
        }

        const userInfo = infoRes && infoRes.data.status === "OK" ? infoRes.data.result[0] : null;
        const submissions = statusRes.data.result;
        const allProblems = problemsetRes.data.result.problems;

        const solvedProblems = new Set();
        const tagCounts = {};

        submissions.forEach(sub => {
            if (sub.verdict === "OK") {
                const problem = sub.problem;
                const problemId = problem.contestId && problem.index 
                    ? `${problem.contestId}-${problem.index}` 
                    : problem.name;

                if (!solvedProblems.has(problemId)) {
                    solvedProblems.add(problemId);
                    const tags = problem.tags || [];
                    tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                }
            }
        });

        // Determine target rating range
        const userRating = userInfo ? (userInfo.rating || 1200) : 1200;
        const targetMin = Math.max(800, Math.min(userRating - 100, 3300));
        const targetMax = Math.max(800, Math.min(userRating + 200, 3500));

        // Find weak common tags
        const commonTagStatus = COMMON_TAGS.map(tag => {
            return {
                tag,
                count: tagCounts[tag] || 0
            };
        }).sort((a, b) => a.count - b.count); // Ascending order: least solved first

        // Select top 3 weakest common tags
        const focusTags = commonTagStatus.slice(0, 3).map(item => item.tag);

        // Filter and find recommended problems
        const recommendations = [];
        // Sort problems by contestId descending (newer first) to get relevant modern tasks
        const sortedProblems = [...allProblems].sort((a, b) => b.contestId - a.contestId);

        for (const problem of sortedProblems) {
            if (!problem.rating || problem.rating < targetMin || problem.rating > targetMax) {
                continue;
            }

            const problemId = problem.contestId && problem.index 
                ? `${problem.contestId}-${problem.index}` 
                : problem.name;

            if (solvedProblems.has(problemId)) {
                continue;
            }

            // Check if the problem matches any of the focus tags
            const matchesFocusTag = (problem.tags || []).some(tag => focusTags.includes(tag));
            if (matchesFocusTag) {
                recommendations.push(problem);
                if (recommendations.length >= 5) {
                    break;
                }
            }
        }

        // Output results
        console.log(`=== RECOMMENDATION ENGINE FOR ${handle.toUpperCase()} ===`);
        if (userInfo) {
            console.log(`Current Rating: ${userRating} (${userInfo.rank || "N/A"})`);
        } else {
            console.log(`Current Rating: ${userRating} (Default/Unrated)`);
        }
        console.log(`Target Difficulty Range: ${targetMin} - ${targetMax}\n`);

        console.log("Focus Areas Identified (Least Practiced Core Topics):");
        focusTags.forEach((tag, index) => {
            const count = tagCounts[tag] || 0;
            console.log(`  ${index + 1}. ${formatTagName(tag)} (Only ${count} solved)`);
        });

        console.log("\nRecommended Problems to Solve:");
        if (recommendations.length > 0) {
            recommendations.forEach((prob, index) => {
                const id = `${prob.contestId}${prob.index}`;
                const url = `https://codeforces.com/problemset/problem/${prob.contestId}/${prob.index}`;
                console.log(`  ${index + 1}. [${id}] ${prob.name}`);
                console.log(`     Rating: ${prob.rating} | Tags: ${prob.tags.map(formatTagName).join(', ')}`);
                console.log(`     URL: ${url}\n`);
            });
        } else {
            console.log("  No exact matches found matching your target rating and focus tags. Try expanding your search!");
        }
        console.log("==================================================");

    } catch (error) {
        console.error("Error generating recommendations:", error.message);
    }
}

main();
