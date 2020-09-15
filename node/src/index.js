// const main = require("./index");
const fs = require("fs");
const path = require("path");

const main = async () => {
    console.clear();
    console.info("Console --- 52", 52);
    let f = await fs.readFileSync(path.resolve("./src/nps.html"), "utf-8");
    let mat = f.match(/<tr(.[\s\S]*?)>(.[\s\S]*?)<\/tr>/g);
    mat[1].match(/<td(.[\s\S]*?)(.[\s\S]*?)<\/td>/g).map(e =>
        e
            .replace(/<td(.*?)/g, "")
            .replace(/<\/td(.*?)>/g, "")
            .trim()
    );
};

(async () => {
    await main();
})();

// module.exports = main;
