const { formatTagName } = require("../utils/formatTag");

class StrengthEngine {
    static analyze(tagCounts) {
        const elite = [];
        const strong = [];
        const developing = [];
        const weak = [];

        const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
        if (sortedTags.length === 0) {
            return { elite, strong, developing, weak };
        }

        const maxCount = sortedTags[0][1];

        sortedTags.forEach(([tag, count]) => {
            const ratio = count / maxCount;
            const entry = {
                tag: formatTagName(tag),
                count
            };
            if (ratio >= 0.6) {
                elite.push(entry);
            } else if (ratio >= 0.25) {
                strong.push(entry);
            } else if (ratio >= 0.05) {
                developing.push(entry);
            } else {
                weak.push(entry);
            }
        });

        return { elite, strong, developing, weak };
    }
}

module.exports = StrengthEngine;
