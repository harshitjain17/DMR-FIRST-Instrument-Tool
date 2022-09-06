import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import React, { useState } from "react";



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

export function SearchAddressField({ xlargeScreen, address: enteredAddress, onAddressChanged, distance }: ISearchAddressProps) {

    const [focused, setFocues] = useState(false);
    const addressChangeHandler = (event: any) => {
        onAddressChanged(event.target.value);
    };

    return (
        <div>
            <TextField
                id="formAddress"
                fullWidth={true}
                size={xlargeScreen ? "medium" : "small"}
                onChange={addressChangeHandler}
                value={enteredAddress}
                label="Find instruments near"
                variant="outlined"
                onFocus={() => { setFocues(true) }}
                onBlur={() => { setFocues(false) }}
                helperText={focused ? "Enter the location near which you want to search for the instrument." : ""}
                required={distance !== '0'}
                data-error="Required when maximum Distance is set"
            />
        </div>
    );
}

export function DistanceField({ xlargeScreen, distance: enteredDistance, onDistanceChanged }: ISearchDistanceProps) {
    const [focused, setFocused] = useState(false);
    const distanceChangeHandler = (event: any) => {
        onDistanceChanged(event.target.value);
    };

    return (
        <div className={xlargeScreen ? "mt-4" : "mt-3"}>
            <TextField
                id="formDistance"
                fullWidth={true}
                size={xlargeScreen ? "medium" : "small"}
                select
                label="Maximum Distance"
                value={enteredDistance}
                onChange={distanceChangeHandler}
                onFocus={() => { setFocused(true) }}
                onBlur={() => { setFocused(false) }}
                helperText={focused ? "Select the distance radius." : ""}
            >
                <MenuItem key="25" value="25">25 miles</MenuItem>
                <MenuItem key="50" value="50">50 miles</MenuItem>
                <MenuItem key="75" value="75">75 miles</MenuItem>
                <MenuItem key="100" value="100">100 miles</MenuItem>
                <MenuItem key="150" value="150">150 miles</MenuItem>
                <MenuItem key="200" value="200">200 miles</MenuItem>
                <MenuItem key="0" value="0">US</MenuItem>
            </TextField>
        </div>
    )
}