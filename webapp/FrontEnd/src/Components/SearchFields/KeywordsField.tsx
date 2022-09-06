import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import React, { KeyboardEvent, SyntheticEvent, useState } from "react"


interface IKeywordsFieldProps {
    xlargeScreen: boolean,
    keywords: string[],
    onKeywordsChanged: (value: string[]) => void
}


export function KeywordsField({ xlargeScreen, keywords, onKeywordsChanged }: IKeywordsFieldProps) {
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const inputChange = (event: any) => {
        const entered = event.target.value;
        setInputValue(entered)
    };


    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && inputValue) {
            onKeywordsChanged([...keywords, inputValue])
            setInputValue('');
        }
    }

    const handleBlur = () => {
        if (inputValue) {
            onKeywordsChanged([...keywords, inputValue])
            setInputValue('');
        }
        setFocused(false)
    }


    const removeKeyword = (keyword: string) => {
        onKeywordsChanged(keywords.filter(k => k !== keyword));
    }



    return (
        <div className={xlargeScreen ? "mt-4" : "mt-3"}>
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
                onFocus={() => { setFocused(true) }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                helperText={focused ? "Search for keywords in the instrument name, capabilities or description section, manufacturer and the model number." : ""}

            />
        </div>
    )
}