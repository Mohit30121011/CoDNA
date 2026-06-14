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

        const totalTags = sortedTags.length;

        sortedTags.forEach(([tag, count], index) => {
            const percentile = (index / totalTags) * 100;
            const entry = { tag: formatTagName(tag), count };

            if (percentile <= 15 && count >= 50) {
                elite.push(entry);
            } else if (percentile <= 40 && count >= 20) {
                strong.push(entry);
            } else if (percentile <= 75 && count >= 5) {
                developing.push(entry);
            } else {
                weak.push(entry);
            }
        });

        return { elite, strong, developing, weak };
    }
}

module.exports = StrengthEngine;
