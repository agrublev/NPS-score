import React, { useRef, useState } from "react";
import { Box, Button, TextField } from "@material-ui/core";
// import "./styles.css";

export default () => {
    const fileInput = useRef(null);
    const [fileName, setFileName] = useState("Choose file");

    const openFileLoader = () => {
        fileInput.current.click();
    };

    const updateFile = evt => {
        const updatedFileName = evt.target.value.split("\\").pop();
        setFileName(updatedFileName);
    };

    const readFile = () => {
        const reader = new FileReader();
        const file = fileInput.current.files[0];

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

    const clearInput = () => {};

    return (
        <Box display="flex" flexDirection="column" alignItems="flex-start">
            <label>
                <input
                    ref={fileInput}
                    type="file"
                    style={{ display: "none" }}
                    onChange={updateFile}
                />
                <TextField
                    margin="dense"
                    variant="outlined"
                    value={fileName}
                    inputProps={{ style: { color: "blue", cursor: "pointer" } }}
                    onClick={openFileLoader}
                    disabled
                />
            </label>
            <Button onClick={readFile} variant="outlined" margin="dense">
                Log File Info
            </Button>
            <Button onClick={clearInput} variant="outlined" margin="dense">
                Clear File
            </Button>
        </Box>
    );
};
