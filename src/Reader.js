import NPS from "net-promoter-score";
import React, { Component } from "react";
import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import moment from "moment-mini";

// let mMonth = localStorage.getItem("monthResults");
// let mYear = localStorage.getItem("yearResults");
const median = arr => {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
class Reader extends Component {
    @observable value = "file name";
    @observable yearResults = null; //mMonth !== undefined ? JSON.parse(mMonth) : null;
    @observable monthResults = null; //mYear !== undefined ? JSON.parse(mYear) : null;

    render() {
        return (
            <div className="Reader">
                {this.yearResults === null ? (
                    <div className={"upload"}>
                        <h2>Upload saved nps .html file from</h2>
                        <div>
                            <a
                                target={"_blank"}
                                className={"cactus"}
                                href={"https://cactus.freedcamp.com/stats/scores"}
                            >
                                Visit Cactus NPS in new tab
                            </a>
                            <blockquote>
                                When you visit the page click Ctrl/Cmd+S to save it as html file!
                            </blockquote>
                        </div>
                        <input
                            className={"up"}
                            ref={this.fileInput}
                            type="file"
                            onChange={this.updateFile}
                        />
                        <p>{this.value}</p>
                    </div>
                ) : (
                    <div className={"results"}>
                        <h2>YEARS</h2>
                        <div className={"scores"}>
                            {Object.keys(this.yearResults).map(year => {
                                return (
                                    <div className={"scoreWrap"}>
                                        <div className={"year"}>{year}</div>
                                        <div
                                            className={"score"}
                                            style={{ height: `${this.yearResults[year].score}%` }}
                                        >
                                            {this.yearResults[year].score}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <h2>MONTHS</h2>
                        {Object.keys(this.monthResults)
                            .sort((a, b) => parseInt(b.split("-")[0]) - parseInt(a.split("-")[0]))
                            .map(year => {
                                return (
                                    <div>
                                        <h2>YEAR {year}</h2>
                                        <div className={"scores"}>
                                            {Object.keys(this.monthResults[year])
                                                .sort((a, b) => parseInt(a) - parseInt(b))
                                                .map(month => {
                                                    return (
                                                        <div
                                                            className={"scoreWrap"}
                                                            title={`Median: ${this.monthResults[year][month].median}`}
                                                        >
                                                            <div className={"year"}>{month}</div>
                                                            <div
                                                                className={"score"}
                                                                style={{
                                                                    height: `${
                                                                        this.monthResults[year][
                                                                            month
                                                                        ].nps < 20
                                                                            ? 10
                                                                            : this.monthResults[
                                                                                  year
                                                                              ][month].nps
                                                                    }%`
                                                                }}
                                                            >
                                                                {this.monthResults[year][month].nps}
                                                            </div>
                                                            <div className={"score average"}>
                                                                {
                                                                    this.monthResults[year][month]
                                                                        .average
                                                                }
                                                                /10
                                                            </div>
                                                            {/*<div className={"score median"}>*/}
                                                            {/*    {this.monthResults[year][month].median}*/}
                                                            {/*</div>*/}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        );
    }

    updateFile = evt => {
        const updatedFileName = evt.target.value.split("\\").pop();
        // setFileName(updatedFileName);
        this.value = updatedFileName;
        this.readFile(evt.target);
    };

    readFile = fileInput => {
        const reader = new FileReader();
        const file = fileInput.files[0];
        console.clear();
        if (file) {
            reader.readAsText(file);

            reader.onload = () => {
                this.showNPS(reader.result);
            };

            reader.onerror = function() {
                console.log(reader.error);
            };
        }
    };
    showNPS = file => {
        let years = {};
        let months = {};
        let mat = file.match(/<tr(.[\s\S]*?)>(.[\s\S]*?)<\/tr>/g);
        let scores = [];
        mat.forEach((a, i) => {
            let cols = a.match(/<td(.[\s\S]*?)<\/td>/g);

            if (cols) {
                cols = cols.map(e =>
                    e
                        .replace(/<td(.*?)>/g, "")
                        .replace(/<\/td(.*?)>/g, "")
                        .replace(">\n", "")
                        .trim()
                );
                let year = moment(cols[2]).format("YYYY");
                let month = `${year}-${moment(cols[2]).format("MM")}`;
                if (years[year] === undefined) {
                    years[year] = [];
                }
                if (months[month] === undefined) {
                    months[month] = [];
                }
                scores.push({ score: cols[1], date: cols[2] });
                years[year].push({ score: cols[1], date: cols[2] });
                months[month].push({ score: cols[1], date: cols[2] });
            }
        });
        console.log("RES", years, months);

        // console.log("--- INFO ", scores);
        this.monthResults = this.calcMonths(months);
        this.yearResults = this.calcYear(years);
        localStorage.setItem("monthResults", JSON.stringify(this.monthResults));
        localStorage.setItem("yearResults", JSON.stringify(this.yearResults));
    };
    calcYear = years => {
        let yearsScores = {};

        Object.keys(years).forEach(year => {
            let yyy = years[year];
            let scoreList = yyy.map(e => parseInt(e.score)).filter(e => e > 0 && e < 11);

            let firstScores = new NPS(scoreList);
            yearsScores[year] = firstScores;
        });
        return yearsScores;
    };
    calcMonths = months => {
        let years = {};

        Object.keys(months).forEach(name => {
            let year = name.split("-")[0];
            let month = name.split("-")[1];
            if (years[year] === undefined) {
                years[year] = {};
            }
            if (years[year][month] === undefined) {
                years[year][month] = {};
            }
            let scoreList = months[name]
                .map(e => parseInt(e.score))
                .filter(e => {
                    if (e > -1 && e < 11) {
                        return true;
                    }
                    console.log("DIDNT", e);
                    return false;
                });
            let { score: nps } = new NPS(scoreList);
            years[year][month].nps = nps;
            years[year][month].average = average(...scoreList);
            years[year][month].median = median(scoreList);
        });

        return years;
    };
}
const average = (...nums) => Math.round(nums.reduce((acc, val) => acc + val, 0) / nums.length);

export default observer(Reader);
