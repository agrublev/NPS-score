import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

// Thats cool

if (module.hot) {
    module.hot.accept(); // already had this init code

    module.hot.addStatusHandler(status => {
        if (status === "prepare") console.clear();
    });
}
