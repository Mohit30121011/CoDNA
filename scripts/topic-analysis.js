const axios = require("axios");

const handle = process.argv[2];
if (!handle) {
    console.error("Please provide a Codeforces handle. Example: node scripts/topic-analysis.js tourist");
    process.exit(1);
}

const url = `https://codeforces.com/api/user.status?handle=${handle}`;

axios.get(url)
    .then(response => {
        const solvedProblems = new Set();
        const topicCounts = {};
        
        const submissions = response.data.result;
        submissions.forEach(submission => {
            if (submission.verdict === "OK") {
                const problem = submission.problem;
                const problemId = problem.contestId && problem.index 
                    ? `${problem.contestId}-${problem.index}` 
                    : problem.name;
                
                if (!solvedProblems.has(problemId)) {
                    solvedProblems.add(problemId);
                    const tags = problem.tags || [];
                    tags.forEach(tag => {
                        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
                    });
                }
            }
        });

        const sortedTags = Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1]);

        function formatTagName(tag) {
            if (tag === 'dp') return 'DP';
            if (tag === 'dsu') return 'DSU';
            if (tag === 'fft') return 'FFT';
            if (tag === '2-sat') return '2-SAT';
            return tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        console.log("TOP TOPICS\n");
        sortedTags.slice(0, 10).forEach(([tag, count], index) => {
            console.log(`${index + 1}. ${formatTagName(tag)} (${count})`);
        });
    })
    .catch(error => {
        console.error("Error fetching submissions:", error.message || error);
    });
