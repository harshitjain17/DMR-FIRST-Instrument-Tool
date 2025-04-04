import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import React from "react";
import { HtmlTooltip } from './ToolTipHTMLStyling';



interface ISearchAddressProps {
    xlargeScreen: boolean,
    address: string,
    distance: string,
    onAddressChanged: (value: string) => void
}

interface ISearchDistanceProps {
    xlargeScreen: boolean,
    distance: string,
    onDistanceChanged: (value: string) => void
}

export function SearchAddressField({ xlargeScreen, address, onAddressChanged, distance }: ISearchAddressProps) {
    const addressChangeHandler = (event: any) => {
        onAddressChanged(event.target.value);
    };

    return (
        <div>
            <HtmlTooltip
                title={
                    <React.Fragment>
                        {"Location where you want to search for instruments. Required when a maxium distance ist set."}
                    </React.Fragment>
                }
            >
                <TextField
                    id="formAddress"
                    fullWidth={true}
                    size={xlargeScreen ? "medium" : "small"}
                    onChange={addressChangeHandler}
                    value={address}
                    label="Find instruments near"
                    variant="outlined"
                    required={distance !== '0'}
                    data-error="Required when Maximum Distance is set"
                />
            </HtmlTooltip>
        </div>
    );
}

export function DistanceField({ xlargeScreen, distance: enteredDistance, onDistanceChanged }: ISearchDistanceProps) {
    const distanceChangeHandler = (event: any) => {
        onDistanceChanged(event.target.value);
    };

    return (
        <div className={xlargeScreen ? "mt-4" : "mt-3"}>
            <HtmlTooltip
                title={
                    <React.Fragment>
                        {"Select the maximum distance from the entered location. 'US' shows all instruments in the US."}
                    </React.Fragment>
                }
            >
                <TextField
                    id="formDistance"
                    fullWidth={true}
                    size={xlargeScreen ? "medium" : "small"}
                    select
                    label="Maximum Distance"
                    value={enteredDistance}
                    onChange={distanceChangeHandler}
                >
                    <MenuItem key="25" value="25">25 miles</MenuItem>
                    <MenuItem key="50" value="50">50 miles</MenuItem>
                    <MenuItem key="75" value="75">75 miles</MenuItem>
                    <MenuItem key="100" value="100">100 miles</MenuItem>
                    <MenuItem key="150" value="150">150 miles</MenuItem>
                    <MenuItem key="200" value="200">200 miles</MenuItem>
                    <MenuItem key="0" value="0">US</MenuItem>
                </TextField>
            </HtmlTooltip>
        </div>
    )
}