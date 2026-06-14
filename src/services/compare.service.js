const AnalysisService = require("./analysis.service");
const CompareEngine = require("../engines/compare.engine");

class CompareService {
    static async compareUsers(handle1, handle2) {
        // Fetch both analyses concurrently
        const [user1Stats, user2Stats] = await Promise.all([
            AnalysisService.analyzeUser(handle1),
            AnalysisService.analyzeUser(handle2)
        ]);

        const comparison = CompareEngine.analyze(user1Stats, user2Stats);

        return {
            user1: user1Stats.profile,
            user2: user2Stats.profile,
            comparison
        };
    }
}

module.exports = CompareService;
