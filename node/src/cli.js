const cli = require("cac")("fcli");
const main = require("./index");

(async () => {
    const args = process.argv.slice(2);
    cli.on("command:*", () => {
        console.info("Console --- UNKNOWN COMMAND");
    });

    cli.command("rm <dir>", "Remove a dir")
        .option("-r, --recursive", "Remove recursively")
        .action((dir, options) => {
            console.log("remove " + dir + (options.recursive ? " recursively" : ""));
            main();
        });

    cli.option("--type [type]", "Choose a project type", {
        default: "node"
    });
    cli.option("--name <name>", "Provide your name");

    cli.command("lint [...files]", "Lint files").action((files, options) => {
        console.log(files, options);
    });

    // Display help message when `-h` or `--help` appears
    cli.help();
    // Display version number when `-h` or `--help` appears
    const { version } = require("../package.json");
    cli.version(version);

    cli.parse();
    if (args.length === 0) {
        cli.outputHelp();
    }
})();
