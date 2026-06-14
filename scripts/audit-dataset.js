const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/benchmark-dataset.json', 'utf8'));

console.log("\n--- AUDIT 3: Outlier Detection ---");
const outlierTags = ["fft", "flows", "2-sat"];

for (const [bucketName, bucketData] of Object.entries(data.buckets)) {
    console.log(`\nBucket: ${bucketName}`);
    outlierTags.forEach(tag => {
        const stats = bucketData.topicStats[tag];
        if (stats) {
            console.log(`  ${tag.toUpperCase()}: Avg=${stats.avg}, Median=${stats.median}, p90=${stats.p90}`);
            if (stats.avg > stats.median * 2 && stats.median > 0) {
                console.log(`    ⚠️ Outlier skew detected: Average is more than double the median!`);
            }
        }
    });
}
