const axios = require("axios");

const user1 = process.argv[2];
const user2 = process.argv[3] || "tourist"; // Default competitor is tourist

if (!user1) {
    console.error("Please provide at least one Codeforces handle. Example: node scripts/benchmark-engine.js your_handle [compare_to_handle]");
    process.exit(1);
}

function formatTagName(tag) {
    if (tag === 'dp') return 'DP';
    if (tag === 'dsu') return 'DSU';
    if (tag === 'fft') return 'FFT';
    if (tag === '2-sat') return '2-SAT';
    return tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function getUserData(handle) {
    const infoUrl = `https://codeforces.com/api/user.info?handles=${handle}`;
    const statusUrl = `https://codeforces.com/api/user.status?handle=${handle}`;
    
    const [infoRes, statusRes] = await Promise.all([
        axios.get(infoUrl),
        axios.get(statusUrl)
    ]);

    if (infoRes.data.status !== "OK" || statusRes.data.status !== "OK") {
        throw new Error(`Failed to fetch data for ${handle}`);
    }

    const info = infoRes.data.result[0];
    const submissions = statusRes.data.result;

    const solvedProblems = new Set();
    const tagCounts = {};
    let totalRating = 0;
    let ratedCount = 0;
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
                }

                const tags = problem.tags || [];
                tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        }
    });

    const accuracy = submissions.length > 0 ? (totalOK / submissions.length) * 100 : 0;
    const avgDifficulty = ratedCount > 0 ? Math.round(totalRating / ratedCount) : 0;
    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

    return {
        handle,
        rank: info.rank || "Unrated",
        maxRank: info.maxRank || "Unrated",
        rating: info.rating || 0,
        maxRating: info.maxRating || 0,
        solvedCount: solvedProblems.size,
        accuracy,
        avgDifficulty,
        topTags: sortedTags.slice(0, 3).map(([tag, count]) => `${formatTagName(tag)} (${count})`)
    };
}

async function main() {
    try {
        console.log(`Fetching and analyzing data for ${user1.toUpperCase()} vs ${user2.toUpperCase()}...\n`);
        const [data1, data2] = await Promise.all([
            getUserData(user1),
            getUserData(user2)
        ]);

        console.log(`==================================================================`);
        console.log(`   📊 BENCHMARK COMPARISON: ${data1.handle.toUpperCase()} vs ${data2.handle.toUpperCase()} 📊`);
        console.log(`==================================================================`);
        console.log(String("").padEnd(25) + ` | ${data1.handle.toUpperCase().padEnd(18)} | ${data2.handle.toUpperCase().padEnd(18)}`);
        console.log("-".repeat(66));

        console.log(`Current Rating`.padEnd(25) + ` | ${String(data1.rating).padEnd(18)} | ${String(data2.rating).padEnd(18)}`);
        console.log(`Peak Rating`.padEnd(25) + ` | ${String(data1.maxRating).padEnd(18)} | ${String(data2.maxRating).padEnd(18)}`);
        console.log(`Current Rank`.padEnd(25) + ` | ${data1.rank.padEnd(18)} | ${data2.rank.padEnd(18)}`);
        console.log(`Peak Rank`.padEnd(25) + ` | ${data1.maxRank.padEnd(18)} | ${data2.maxRank.padEnd(18)}`);
        console.log(`Unique Solved`.padEnd(25) + ` | ${String(data1.solvedCount).padEnd(18)} | ${String(data2.solvedCount).padEnd(18)}`);
        console.log(`Accuracy (OK/Total)`.padEnd(25) + ` | ${(data1.accuracy.toFixed(1) + "%").padEnd(18)} | ${(data2.accuracy.toFixed(1) + "%").padEnd(18)}`);
        console.log(`Avg Solved Difficulty`.padEnd(25) + ` | ${String(data1.avgDifficulty).padEnd(18)} | ${String(data2.avgDifficulty).padEnd(18)}`);
        console.log("-".repeat(66));

        console.log("Top 3 Topics:");
        for (let i = 0; i < 3; i++) {
            const tag1 = data1.topTags[i] || "N/A";
            const tag2 = data2.topTags[i] || "N/A";
            console.log(`  #${i+1}`.padEnd(25) + ` | ${tag1.padEnd(18)} | ${tag2.padEnd(18)}`);
        }
        console.log(`==================================================================\n`);

        // Brief comparative insight
        console.log("💡 INSIGHT:");
        const ratingDiff = data1.rating - data2.rating;
        if (ratingDiff > 0) {
            console.log(`  You are leading ${data2.handle} by ${ratingDiff} rating points! Great work.`);
        } else if (ratingDiff < 0) {
            console.log(`  You are trailing ${data2.handle} by ${Math.abs(ratingDiff)} rating points. Keep practicing!`);
        } else {
            console.log(`  You are currently neck-and-neck with ${data2.handle} in rating!`);
        }

        const solvedDiff = data1.solvedCount - data2.solvedCount;
        if (solvedDiff > 0) {
            console.log(`  You have solved ${solvedDiff} more unique problems than ${data2.handle}.`);
        } else if (solvedDiff < 0) {
            console.log(`  ${data2.handle} has solved ${Math.abs(solvedDiff)} more unique problems. Target more problems!`);
        }

    } catch (error) {
        console.error("Error running benchmark analysis:", error.message);
    }
}

main();
