import NPS from "net-promoter-score";
import React, { Component } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import moment from "moment-mini";

class Reader extends Component {
    @observable value = "file name";
    @observable yearResults = null;
    @observable monthResults = null;

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
                            {Object.keys(this.yearResults).map((year) => {
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
                            .map((year) => {
                                return (
                                    <div>
                                        <h2>YEAR {year}</h2>
                                        <div className={"scores"}>
                                            {Object.keys(this.monthResults[year])
                                                .sort((a, b) => parseInt(a) - parseInt(b))
                                                .map((month) => {
                                                    return (
                                                        <div className={"scoreWrap"}>
                                                            <div className={"year"}>{month}</div>
                                                            <div
                                                                className={"score"}
                                                                style={{
                                                                    height: `${this.monthResults[year][month].score}%`,
                                                                }}
                                                            >
                                                                {
                                                                    this.monthResults[year][month]
                                                                        .score
                                                                }
                                                            </div>
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

    updateFile = (evt) => {
        const updatedFileName = evt.target.value.split("\\").pop();
        // setFileName(updatedFileName);
        this.value = updatedFileName;
        this.readFile(evt.target);
    };

    readFile = (fileInput) => {
        const reader = new FileReader();
        const file = fileInput.files[0];
        console.clear();
        if (file) {
            reader.readAsText(file);

            reader.onload = () => {
                this.showNPS(reader.result);
            };

            reader.onerror = function () {
                console.log(reader.error);
            };
        }
    };
    showNPS = (file) => {
        let years = {};
        let months = {};
        let mat = file.match(/<tr(.[\s\S]*?)>(.[\s\S]*?)<\/tr>/g);
        let scores = [];
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
        // console.log("--- INFO ", scores);
        this.monthResults = this.calcMonths(months);
        this.yearResults = this.calcYear(years);
    };
    calcYear = (years) => {
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
        return yearsScores;
    };
    calcMonths = (months) => {
        let years = {};

        Object.keys(months).forEach((name) => {
            let year = name.split("-")[0];
            let month = name.split("-")[1];
            if (years[year] === undefined) {
                years[year] = {};
            }
            if (years[year][month] === undefined) {
                years[year][month] = {};
            }
            let firstScores = new NPS(
                months[name]
                    .map((e) => parseInt(e.score))
                    .filter((e) => {
                        // console.log(e);

                        return e > 0 && e < 11;
                    })
            );
            years[year][month] = firstScores;
        });
        console.info("Console --- ", years);

        return years;
    };
}

export default observer(Reader);
