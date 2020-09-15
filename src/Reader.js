import React, { Component } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";

class Reader extends Component {
    @observable value = "None";

    render() {
        return (
            <div className="Reader">
                <h2>READ</h2>
                <input ref={this.fileInput} type="file" onChange={this.updateFile} />
                <button onClick={this.readFile} variant="outlined" margin="dense">
                    Log File Info
                </button>
                <span>{this.value}</span>
                <button onClick={this._updateValue}>Update value</button>
            </div>
        );
    }

    _updateValue = e => {
        this.value = "Date: " + Date.now();
    };

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

            reader.onload = function() {
                console.log(reader.result);
            };

            reader.onerror = function() {
                console.log(reader.error);
            };
        }
    };
}

export default observer(Reader);
