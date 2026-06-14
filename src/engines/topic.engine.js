const { formatTagName } = require("../utils/formatTag");

class TopicEngine {
    static analyze(tagCounts) {
        const raw = { ...tagCounts };
        
        const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1]);
            
        const top = sortedTags.map(([tag, count]) => ({
            name: formatTagName(tag),
            count
        }));

        return { raw, top };
    }
}

module.exports = TopicEngine;
