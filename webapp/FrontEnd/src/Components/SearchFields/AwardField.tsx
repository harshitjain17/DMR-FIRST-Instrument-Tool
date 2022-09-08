import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

interface IAwardNumberProps {
    xlargeScreen: boolean,
    awardNumber: string,
    onAwardNumberChanged: (value: string) => void
}


export function AwardField({ xlargeScreen, awardNumber, onAwardNumberChanged }: IAwardNumberProps) {
    // const [focused, setFocus] = useState(false);

    const awardNumberChangeHandler = (event: any) => {
        onAwardNumberChanged(event.target.value);
    };

    return (
        <div className={xlargeScreen ? "mt-4" : "mt-3"}>
            <Tooltip title="Filter by NSF Award Number.">
                <TextField
                    id="formAwardNumber"
                    fullWidth={true}
                    size={xlargeScreen ? "medium" : "small"}
                    value={awardNumber}
                    onChange={awardNumberChangeHandler}
                    label="Award Number"
                    variant="outlined"
                    // onFocus={() => { setFocus(true) }}
                    // onBlur={() => { setFocus(false) }}
                    // helperText={focused ? "Filter by NSF Award Number." : ""}
                />
            </Tooltip>
        </div>

    );
}