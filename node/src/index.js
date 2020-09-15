// const main = require("./index");
const fs = require("fs");
const path = require("path");
const moment = require("moment-mini");
const NPS = require("net-promoter-score");

const main = async () => {
    console.clear();
    // console.info("Console --- 52", 52);
    let f = await fs.readFileSync(path.resolve("./src/nps.html"), "utf-8");
    let mat = f.match(/<tr(.[\s\S]*?)>(.[\s\S]*?)<\/tr>/g);
    let scores = [];
    let years = {};

    mat.forEach((a, i) => {
        let cols = a.match(/<td(.[\s\S]*?)<\/td>/g);

        if (cols) {
            cols = cols.map((e) =>
                e
                    .replace(/<td(.*?)>/g, "")
                    .replace(/<\/td(.*?)>/g, "")
                    .replace(">\n", "")
                    .trim()
            );
            if (years[moment(cols[2]).format("YYYY")] === undefined) {
                years[moment(cols[2]).format("YYYY")] = [];
            }
            // console.info("Console --- ", cols);
            scores.push({ score: cols[1], date: cols[2] });
            years[moment(cols[2]).format("YYYY")].push({ score: cols[1], date: cols[2] });
        }
    });
    // console.info("Console --- ", years);
    let yearsScores = {};

    Object.keys(years).forEach((year) => {
        let yyy = years[year];
        let firstScores = new NPS(
            yyy
                .map((e) => parseInt(e.score))
                .filter((e) => {
                    // console.log(e);

                    return e > 0 && e < 11;
                })
        );
        yearsScores[year] = firstScores;
    });
    console.info("Console --- ", yearsScores);
};

(async () => {
    await main();
})();

// module.exports = main;
