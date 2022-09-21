import TextField from "@mui/material/TextField";
import { HtmlTooltip } from "./ToolTipHTMLStyling";
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
            <HtmlTooltip
                title={
                    <React.Fragment>
                        {"Filter by NSF Award Number"}
                    </React.Fragment>
                }
            >
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
            </HtmlTooltip>
        </div>

    );
}