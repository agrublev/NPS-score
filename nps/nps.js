const NPS = require("net-promoter-score");
const scores = require("./nps.json");
const scoresYears = require("./npsYears.json");
const moment = require("moment-mini");
const fs = require("fs");

(async () => {
    // let scoresList = [];
    // const years = {};
    // scores.forEach(function (ss) {
    //     let sz = parseInt(ss.score);
    //     if (0 < sz && sz < 11 && !isNaN(sz)) {
    //         scoresList.push(parseInt(ss.score));
    //         let y = moment(ss.date).format("YYYY");
    //         if (years[y] === undefined) years[y] = [];
    //         years[y].push({ score: sz, date: ss.date });
    //     }
    // });
    Object.keys(scoresYears).forEach((year) => {
        let yyy = scoresYears[year];
        var firstScores = new NPS(yyy.map((e) => e.score));
        console.log(`
${year} =======

detractors ${firstScores.detractors}
passives ${firstScores.passives}
promoters ${firstScores.promoters}
detractorsPercentage ${firstScores.detractorsPercentage}
passivesPercentage ${firstScores.passivesPercentage}
promotersPercentage ${firstScores.promotersPercentage}
summary ${firstScores.summary}
score ${firstScores.score}


`);
    });
    // console.info(JSON.stringify(years));
    // await fs.writeFileSync("npsYears.json", JSON.stringify(years, null, 4));
    // scoresList = scoresList.filter((e) => 0 < parseInt(e) < 11);
    // Create from Scores
    // Object Details
})();
