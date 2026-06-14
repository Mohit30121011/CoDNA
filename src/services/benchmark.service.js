const CodeforcesAdapter = require('../adapters/codeforces.adapter');
const BenchmarkEngine = require('../engines/benchmark.engine');
const { processSubmissions } = require('../utils/deduplicate');

class BenchmarkService {
    static async getBenchmark(handle) {
        const [userInfo, submissions] = await Promise.all([
            CodeforcesAdapter.getUserInfo(handle),
            CodeforcesAdapter.getSubmissions(handle)
        ]);

        if (!submissions || submissions.length === 0) {
            throw new Error(`No submissions found or failed to fetch for ${handle}`);
        }

        const metrics = processSubmissions(submissions);

        const benchmark = BenchmarkEngine.analyze(userInfo, metrics.tagCounts);

        return benchmark;
    }
}

module.exports = BenchmarkService;
