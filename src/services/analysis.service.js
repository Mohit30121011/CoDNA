const CodeforcesAdapter = require("../adapters/codeforces.adapter");
const { processSubmissions } = require("../utils/deduplicate");
const TopicEngine = require("../engines/topic.engine");
const StrengthEngine = require("../engines/strength.engine");
const DNAEngine = require("../engines/dna.engine");
const RecommendationEngine = require("../engines/recommendation.engine");

class AnalysisService {
    static async analyzeUser(handle) {
        const [userInfo, submissions, allProblems] = await Promise.all([
            CodeforcesAdapter.getUserInfo(handle),
            CodeforcesAdapter.getSubmissions(handle),
            CodeforcesAdapter.getProblemset()
        ]);

        if (!submissions || submissions.length === 0) {
            throw new Error(`No submissions found or failed to fetch for ${handle}`);
        }

        const metrics = processSubmissions(submissions);

        const topics = TopicEngine.analyze(metrics.tagCounts);
        const strengths = StrengthEngine.analyze(metrics.tagCounts);
        const dna = DNAEngine.analyze(userInfo, metrics.tagCounts, metrics);
        const recommendations = RecommendationEngine.generate(
            userInfo, 
            metrics.tagCounts, 
            metrics.solvedProblems, 
            allProblems
        );

        return {
            profile: {
                handle: userInfo ? userInfo.handle : handle,
                rating: userInfo ? userInfo.rating : null,
                maxRating: userInfo ? userInfo.maxRating : null,
                rank: userInfo ? userInfo.rank : "unrated"
            },
            topics,
            strengths,
            dna,
            recommendations
        };
    }
}

module.exports = AnalysisService;
