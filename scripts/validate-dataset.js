const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/benchmark-dataset.json', 'utf8'));

let errors = 0;

for (const [bucketName, bucketData] of Object.entries(data.buckets)) {
    console.log(`\nChecking bucket: ${bucketName}`);
    for (const [tag, stats] of Object.entries(bucketData.topicStats)) {
        if (!(stats.median <= stats.p75 && stats.p75 <= stats.p90)) {
            console.error(`ERROR in ${bucketName} for tag ${tag}: Violates median <= p75 <= p90. Data:`, stats);
            errors++;
        }
    }
}

const b800 = data.buckets["800-1200"];
const b2400 = data.buckets["2400-3000"];

const tagsToCheck = ["dp", "graphs", "math", "trees"];
console.log("\nComparing 800-1200 vs 2400-3000:");

tagsToCheck.forEach(tag => {
    const p90_800 = b800.topicStats[tag] ? b800.topicStats[tag].p90 : 0;
    const p90_2400 = b2400.topicStats[tag] ? b2400.topicStats[tag].p90 : 0;
    
    console.log(`${tag.toUpperCase()}: 800-1200 (p90: ${p90_800}) vs 2400-3000 (p90: ${p90_2400})`);
    if (p90_800 >= p90_2400 && p90_2400 > 0) {
        console.error(`WARNING: 800-1200 outperforms 2400-3000 in ${tag}!`);
        errors++;
    }
});

console.log(`\nTotal Validation Errors: ${errors}`);
