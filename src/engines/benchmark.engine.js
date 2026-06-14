const fs = require('fs');
const path = require('path');

class BenchmarkEngine {
    static dataset = null;

    static loadDataset() {
        if (!BenchmarkEngine.dataset) {
            const dataPath = path.join(__dirname, '../data/benchmark-dataset.json');
            try {
                const raw = fs.readFileSync(dataPath, 'utf8');
                BenchmarkEngine.dataset = JSON.parse(raw);
            } catch (err) {
                console.error("Failed to load benchmark dataset:", err);
                BenchmarkEngine.dataset = { buckets: {} };
            }
        }
    }

    static getBucketName(rating) {
        if (!rating) return "800-1200";
        if (rating < 1200) return "800-1200";
        if (rating < 1600) return "1200-1600";
        if (rating < 2000) return "1600-2000";
        if (rating < 2400) return "2000-2400";
        if (rating < 3000) return "2400-3000";
        return "3000+";
    }

    static getStatusLabel(percentile) {
        if (percentile >= 99) return "Legendary";
        if (percentile >= 90) return "Exceptional";
        if (percentile >= 75) return "Above Average";
        if (percentile >= 40) return "Average";
        if (percentile >= 20) return "Below Average";
        return "Weak";
    }

    static calculatePercentile(count, median, p75, p90) {
        if (count <= 0) return 0;
        
        if (count <= median) {
            if (median === 0) return 0;
            return (count / median) * 50;
        }
        if (count <= p75) {
            const range = p75 - median;
            if (range === 0) return 50;
            return 50 + ((count - median) / range) * 25;
        }
        if (count <= p90) {
            const range = p90 - p75;
            if (range === 0) return 75;
            return 75 + ((count - p75) / range) * 15;
        }

        // Above p90
        const excess = count - p90;
        const buffer = p90 > 0 ? p90 : 10;
        const extraPercentile = Math.min(9, (excess / buffer) * 9);
        return 90 + extraPercentile;
    }

    static analyze(userInfo, tagCounts) {
        BenchmarkEngine.loadDataset();
        const bucketName = BenchmarkEngine.getBucketName(userInfo?.rating);
        const bucketData = BenchmarkEngine.dataset.buckets[bucketName] || { topicStats: {} };

        const benchmark = {};

        // We want to analyze every tag the user has solved, plus any major topics from the dataset they missed.
        // For simplicity, we benchmark tags they have in tagCounts.
        Object.entries(tagCounts).forEach(([tag, count]) => {
            const stats = bucketData.topicStats[tag] || { avg: 0, median: 0, p75: 0, p90: 0 };
            
            let rawPercentile = BenchmarkEngine.calculatePercentile(count, stats.median, stats.p75, stats.p90);
            const percentile = Math.min(99, Math.round(rawPercentile));

            benchmark[tag] = {
                user: count,
                bucketAverage: stats.avg,
                median: stats.median,
                p90: stats.p90,
                delta: count - stats.avg,
                percentile: percentile,
                status: BenchmarkEngine.getStatusLabel(percentile)
            };
        });

        return benchmark;
    }
}

module.exports = BenchmarkEngine;
