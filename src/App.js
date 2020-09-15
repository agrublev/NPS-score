import { hot } from "react-hot-loader";
import React from "react";
import "./App.less";
import { observer } from "mobx-react";
import { observable } from "mobx";
import ComponentExample from "./ComponentExample";
import Read from "./read";
import Reader from "./Reader";
@observer
class App extends React.Component {
    @observable tree = "sex";

    render() {
        return (
            <div className="App">
                <Read />
                <Reader />
                <header className="App-header">
                    <button
                        id={"test"}
                        onClick={() => {
                            this.tree = "dream" + Date.now();
                        }}
                    >
                        Change Things
                    </button>
                    <div>
                        {this.tree} Edit <code>src/App.js</code> and save to reload.
                        <p>
                            <a
                                className="App-link"
                                href="https://reactjs.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Learn React
                            </a>
                        </p>
                    </div>
                </header>
                <ComponentExample />
            </div>
        );
    }
}

export default hot(module)(App);
