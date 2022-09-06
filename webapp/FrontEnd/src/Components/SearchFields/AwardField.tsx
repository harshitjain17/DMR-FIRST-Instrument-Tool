import TextField from "@mui/material/TextField";
import React, { useState } from "react";

interface IAwardNumberProps {
    xlargeScreen: boolean,
    awardNumber: string,
    onAwardNumberChanged: (value: string) => void
}


export function AwardField({ xlargeScreen, awardNumber, onAwardNumberChanged }: IAwardNumberProps) {
    const [focused, setFocus] = useState(false);

    const awardNumberChangeHandler = (event: any) => {
        onAwardNumberChanged(event.target.value);
    };

    return (
        <div className={xlargeScreen ? "mt-4" : "mt-3"}>
            <TextField
                id="formAwardNumber"
                fullWidth={true}
                size={xlargeScreen ? "medium" : "small"}
                value={awardNumber}
                onChange={awardNumberChangeHandler}
                label="Award Number"
                variant="outlined"
                onFocus={() => { setFocus(true) }}
                onBlur={() => { setFocus(false) }}
                helperText={focused ? "Enter the exact award number (optional)." : ""}
            />
        </div>

    );
}