const CodeforcesAdapter = require("../adapters/codeforces.adapter");
const { processSubmissions } = require("../utils/deduplicate");
const TopicEngine = require("../engines/topic.engine");
const StrengthEngine = require("../engines/strength.engine");
const DNAEngine = require("../engines/dna.engine");
const RecommendationEngine = require("../engines/recommendation.engine");

class AnalysisService {
    static async analyzeUser(handle) {
        const [userInfo, submissions, allProblems, contestHistory] = await Promise.all([
            CodeforcesAdapter.getUserInfo(handle),
            CodeforcesAdapter.getSubmissions(handle),
            CodeforcesAdapter.getProblemset(),
            CodeforcesAdapter.getContestHistory(handle)
        ]);

        if (!submissions || submissions.length === 0) {
            throw new Error(`No submissions found or failed to fetch for ${handle}`);
        }

        const metrics = processSubmissions(submissions);

        const topics = TopicEngine.analyze(metrics.tagCounts);
        const strengths = StrengthEngine.analyze(metrics.tagCounts);
        const dna = DNAEngine.analyze(userInfo, metrics.tagCounts, metrics, contestHistory);
        const recommendations = RecommendationEngine.generate(
            userInfo, 
            metrics.tagCounts, 
            metrics.solvedProblems, 
            allProblems
        );

        const summary = {
            strengthCount: strengths.elite.length + strengths.strong.length,
            weaknessCount: strengths.weak.length,
            dominantTopic: topics.top.length > 0 ? topics.top[0].name : "None",
            solvedProblems: metrics.solvedProblems.size,
            contestExperience: userInfo && userInfo.rating >= 2100 ? "Elite" : (userInfo && userInfo.rating >= 1600 ? "Experienced" : "Beginner")
        };

        return {
            profile: {
                handle: userInfo ? userInfo.handle : handle,
                rating: userInfo ? userInfo.rating : null,
                maxRating: userInfo ? userInfo.maxRating : null,
                rank: userInfo ? userInfo.rank : "unrated"
            },
            summary,
            topics,
            strengths,
            dna,
            recommendations
        };
    }
}

module.exports = AnalysisService;
