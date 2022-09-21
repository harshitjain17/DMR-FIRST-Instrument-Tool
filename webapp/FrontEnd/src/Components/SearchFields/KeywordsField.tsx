import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import React, { KeyboardEvent,  useState } from "react";
import { HtmlTooltip } from "./ToolTipHTMLStyling";
interface IKeywordsFieldProps {
    xlargeScreen: boolean,
    keywords: string[],
    onKeywordsChanged: (value: string[]) => void
}


export function KeywordsField({ xlargeScreen, keywords, onKeywordsChanged }: IKeywordsFieldProps) {
    const [inputValue, setInputValue] = useState('');

    /**
     * Grab the entered text from the event and save it to a state.
     * Whenever a user presses Enter or clicks elsewhere, the current input is added as a keyword.
     * 
     * @param event 
     */
    const inputChange = (event: any) => {
        const entered = event.target.value;
        setInputValue(entered)
    };

    /**
     * Create a search keyword (displayed as chip) when Enter is pressed
     */
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && inputValue) {
            onKeywordsChanged([...keywords, inputValue])
            setInputValue('');
        }
    }

    /**
     * When the field losses focus, eg. the user clicks elsewhere or starts the search,
     * we create a search keyword, too. Otherwise, the entered keyword would still be visible, but not taken into account,
     * which would most certainly confuse users.
     */ 
    const handleBlur = () => {
        if (inputValue) {
            onKeywordsChanged([...keywords, inputValue])
            setInputValue('');
        }
    }


    /**
     * Chips show a remove button (x), we have to remove the keyword from our list when it is clicked.
     * 
     * @param keyword The keyword to remove
     */
    const removeKeyword = (keyword: string) => {
        onKeywordsChanged(keywords.filter(k => k !== keyword));
    }


    return (
        <div className={xlargeScreen ? "mt-4" : "mt-3"}>
            <HtmlTooltip
                title={
                    <React.Fragment>
                        {"Search for keywords in the instrument name, capabilities, description, manufacturer, and the model number. " + 
                         "If several keywords are entered, all have to be present (connected with AND). " + 
                         "Keywords may contain spaces, use Enter to seperate keywords. "}
                    </React.Fragment>
                }
            >
            <TextField
                    id="formKeywords"
                    label="Keywords (capabilities, manufacturer, model)"
                    fullWidth={true}
                    size={xlargeScreen ? "medium" : "small"}
                    value={inputValue}
                    onChange={inputChange}
                    InputProps={{
                        startAdornment: inputValue || keywords.length ? keywords.map((item) => (
                            <Chip
                                key={item}
                                label={item}
                                size={xlargeScreen ? "medium" : "small"}
                                onDelete={() => removeKeyword(item)} />
                        )) : undefined,
                    }}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            </HtmlTooltip>
        </div>
    )
}