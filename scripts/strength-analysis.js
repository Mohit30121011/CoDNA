const axios = require("axios");

const handle = process.argv[2];
if (!handle) {
    console.error("Please provide a Codeforces handle. Example: node scripts/strength-analysis.js tourist");
    process.exit(1);
}

const url = `https://codeforces.com/api/user.status?handle=${handle}`;

axios.get(url)
    .then(response => {
        if (response.data.status !== "OK") {
            console.error("Failed to fetch data from Codeforces API:", response.data.comment);
            return;
        }

        const submissions = response.data.result;
        const solvedProblems = new Set();
        const tagCounts = {};

        submissions.forEach(submission => {
            if (submission.verdict === "OK") {
                const problem = submission.problem;
                // Uniquely identify a problem by contestId and index, or name
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

        const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

        if (sortedTags.length === 0) {
            console.log("No solved problems found for this user.");
            return;
        }

        const maxCount = sortedTags[0][1];

        const elite = [];
        const strong = [];
        const developing = [];
        const weak = [];

        // Definition of tiers relative to the max count
        // Elite: >= 60% of max count
        // Strong: >= 25% of max count and < 60% of max count
        // Developing: >= 5% of max count and < 25% of max count
        // Weak: < 5% of max count
        function formatTagName(tag) {
            if (tag === 'dp') return 'DP';
            if (tag === 'dsu') return 'DSU';
            if (tag === 'fft') return 'FFT';
            if (tag === '2-sat') return '2-SAT';
            return tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        sortedTags.forEach(([tag, count]) => {
            const ratio = count / maxCount;
            const entry = `${formatTagName(tag)} (${count} solved)`;
            if (ratio >= 0.6) {
                elite.push(entry);
            } else if (ratio >= 0.25) {
                strong.push(entry);
            } else if (ratio >= 0.05) {
                developing.push(entry);
            } else {
                weak.push(entry);
            }
        });

        console.log(`=== STRENGTH PROFILE FOR ${handle.toUpperCase()} ===`);
        console.log(`Total Unique Problems Solved: ${solvedProblems.size}\n`);

        console.log("Elite:");
        if (elite.length > 0) {
            elite.forEach(item => console.log(`  - ${item}`));
        } else {
            console.log("  None");
        }

        console.log("\nStrong:");
        if (strong.length > 0) {
            strong.forEach(item => console.log(`  - ${item}`));
        } else {
            console.log("  None");
        }

        console.log("\nDeveloping:");
        if (developing.length > 0) {
            developing.forEach(item => console.log(`  - ${item}`));
        } else {
            console.log("  None");
        }

        console.log("\nWeak:");
        if (weak.length > 0) {
            weak.forEach(item => console.log(`  - ${item}`));
        } else {
            console.log("  None");
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error.message);
    });
