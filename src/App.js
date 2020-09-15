import { hot } from "react-hot-loader";
import React from "react";
import "./App.less";
import { observer } from "mobx-react";
import { observable } from "mobx";
import Reader from "./Reader";
import html2canvas from "html2canvas";

@observer
class App extends React.Component {
    @observable tree = "sex";

    render() {
        return (
            <div className="App">
                <h1>NPS SCORES</h1>
                <Reader />
                <div>
                    <button
                        onClick={() => {
                            this.screen();
                        }}
                    >
                        TAKE SCREENSHOT
                    </button>
                    <a href={"#"} ref={(r) => (this.refA = r)}>
                        SAVE IMAGE
                    </a>
                </div>
            </div>
        );
    }
    screen = () => {
        html2canvas(document.querySelector("#root")).then((canvas) => {
            document.body.appendChild(canvas);
            let base64URL = canvas
                .toDataURL("image/jpeg")
                .replace("image/jpeg", "image/octet-stream");
            let dataURL = canvas.toDataURL("image/png");
            this.refA.href = dataURL;
            this.refA.click();
            console.log(base64URL);
        });
    };
}

export default hot(module)(App);
