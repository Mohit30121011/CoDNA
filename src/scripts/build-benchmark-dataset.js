const fs = require('fs');
const path = require('path');
const CodeforcesAdapter = require('../adapters/codeforces.adapter');
const { processSubmissions } = require('../utils/deduplicate');

const SAMPLES_PER_BUCKET = 50;

const BUCKETS = [
    { name: "800-1200", min: 800, max: 1200 },
    { name: "1200-1600", min: 1200, max: 1600 },
    { name: "1600-2000", min: 1600, max: 2000 },
    { name: "2000-2400", min: 2000, max: 2400 },
    { name: "2400-3000", min: 2400, max: 3000 },
    { name: "3000+", min: 3000, max: 9999 }
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function calculatePercentile(sortedArr, p) {
    if (sortedArr.length === 0) return 0;
    const index = (p / 100) * (sortedArr.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    if (upper >= sortedArr.length) return sortedArr[lower];
    return Math.round(sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight);
}

function computeStats(values) {
    if (values.length === 0) return { avg: 0, median: 0, p75: 0, p90: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    return {
        avg: Math.round(sum / sorted.length),
        median: calculatePercentile(sorted, 50),
        p75: calculatePercentile(sorted, 75),
        p90: calculatePercentile(sorted, 90)
    };
}

async function buildDataset() {
    console.log("Fetching active users...");
    const users = await CodeforcesAdapter.getActiveUsers();
    console.log(`Found ${users.length} active users.`);

    const bucketedUsers = {};
    BUCKETS.forEach(b => bucketedUsers[b.name] = []);

    users.forEach(u => {
        if (!u.rating) return;
        for (const bucket of BUCKETS) {
            if (u.rating >= bucket.min && u.rating < bucket.max) {
                bucketedUsers[bucket.name].push(u);
                break;
            }
        }
    });

    const dataset = {
        generatedAt: new Date().toISOString().split('T')[0],
        buckets: {}
    };

    for (const bucket of BUCKETS) {
        console.log(`\n--- Processing Bucket: ${bucket.name} ---`);
        let availableUsers = bucketedUsers[bucket.name];
        shuffleArray(availableUsers);
        
        // Take at most SAMPLES_PER_BUCKET
        const selectedUsers = availableUsers.slice(0, SAMPLES_PER_BUCKET);
        console.log(`Selected ${selectedUsers.length} users out of ${availableUsers.length} available.`);

        const bucketUsersMetrics = [];

        for (let i = 0; i < selectedUsers.length; i++) {
            const user = selectedUsers[i];
            console.log(`[${i + 1}/${selectedUsers.length}] Fetching ${user.handle}...`);
            
            const submissions = await CodeforcesAdapter.getSubmissions(user.handle);
            if (!submissions || submissions.length === 0) continue;

            const metrics = processSubmissions(submissions);
            bucketUsersMetrics.push(metrics);
        }

        const successfulSamples = bucketUsersMetrics.length;
        if (successfulSamples === 0) {
            console.log(`No valid samples collected for bucket ${bucket.name}.`);
            continue;
        }

        const allTags = new Set();
        bucketUsersMetrics.forEach(m => {
            Object.keys(m.tagCounts).forEach(tag => allTags.add(tag));
        });

        const topicStats = {};
        allTags.forEach(tag => {
            const counts = bucketUsersMetrics.map(m => m.tagCounts[tag] || 0);
            topicStats[tag] = computeStats(counts);
        });

        const avgSolvedArr = bucketUsersMetrics.map(m => m.solvedProblems.size);
        const avgDifficultyArr = bucketUsersMetrics.map(m => m.avgSolvedRating);

        dataset.buckets[bucket.name] = {
            samples: successfulSamples,
            topicStats,
            ratingStats: {
                avgSolved: computeStats(avgSolvedArr).avg,
                avgDifficulty: computeStats(avgDifficultyArr).avg
            }
        };
    }

    const outputPath = path.join(__dirname, '../data/benchmark-dataset.json');
    fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
    console.log(`\nDataset successfully saved to ${outputPath}`);
}

buildDataset();
