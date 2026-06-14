/**
 * Deduplicates submissions and returns raw tag counts, total rating, rated count, and the Set of unique problem IDs.
 */
function processSubmissions(submissions) {
    const solvedProblems = new Set();
    const tagCounts = {};
    let totalRating = 0;
    let ratedCount = 0;
    let maxSolvedRating = 0;
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
                    if (problem.rating > maxSolvedRating) {
                        maxSolvedRating = problem.rating;
                    }
                }

                const tags = problem.tags || [];
                tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        }
    });

    const totalSubmissions = submissions.length;
    const accuracyRate = totalSubmissions > 0 ? (totalOK / totalSubmissions) * 100 : 0;
    const avgSolvedRating = ratedCount > 0 ? Math.round(totalRating / ratedCount) : 0;

    return {
        solvedProblems,
        tagCounts,
        totalRating,
        ratedCount,
        maxSolvedRating,
        accuracyRate,
        avgSolvedRating
    };
}

module.exports = { processSubmissions };
