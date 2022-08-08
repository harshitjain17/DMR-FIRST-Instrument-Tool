import React, { Fragment, useState} from 'react';
import { Form } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';

import InstoolApi from '../../Api/InstoolApi';
import { InstrumentTypeApi, IDropdownEntry, IInstrumentType } from '../../Api/InstrumentTypeApi';

interface IInstrumentTypeDropdownProps {
    xlargeScreen: boolean,
    enteredInstrumentCategory: string,
    enteredInstrumentType: IDropdownEntry,
    onInstrumentCategorySelected: (value: string | undefined) => void,
    onInstrumentTypeSelected: (value: string | undefined) => void
}

export default function InstrumentTypeDrowns({ 
    xlargeScreen, 
    enteredInstrumentCategory, enteredInstrumentType,
    onInstrumentCategorySelected, onInstrumentTypeSelected}: IInstrumentTypeDropdownProps) {

    const [instrumentCategories, setInstrumentCategories] = useState<IInstrumentType[]>([]);
    const [instrumentTypes, setInstrumentTypes] = useState<IDropdownEntry[]>([]);
    const [instrumentTypeSearchText, setInstrumentTypeSearchText] = useState<string>('');

    
    const instrumentCategoryChangeHandler = (event: any) => {
        onInstrumentCategorySelected(event.target.value);
    };

    const instrumentTypeChangeHandler = (event: React.SyntheticEvent, option: any) => {
        onInstrumentTypeSelected(option);
    };

    // Instrument Categories Dropdown List
    React.useEffect(() => {
        InstrumentTypeApi.getCategories().then((response) => {
            setInstrumentCategories(response);
        });
    }, []);

    // Autocompletion of instrument types
    React.useEffect(() => {
        const fetchData = async () => {
            const response = await InstrumentTypeApi.getDropdownEntries(enteredInstrumentCategory);
            setInstrumentTypes(response);
            onInstrumentTypeSelected(undefined);
        };
        fetchData();
    }, [enteredInstrumentCategory, onInstrumentTypeSelected]); // dependent on category selected


    return (
        <Fragment>
            <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                <Form.Group controlId="formInstrumentCategory">
                    <TextField
                        // options={instrumentCategories}
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        select
                        label="Instrument Category"
                        value={enteredInstrumentCategory}
                        onChange={instrumentCategoryChangeHandler}
                    >
                        {instrumentCategories.map((option) => (
                            <MenuItem key={option.instrumentTypeId} value={option.name}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Form.Group>
            </div>

            <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                <Form.Group controlId="formInstrumentType">
                    <Autocomplete
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.value}>
                                    {option.label}
                                </li>
                            )
                        }}
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        options={instrumentTypes}
                        isOptionEqualToValue={(option, value) => option?.value === value?.value}
                        groupBy={(option) => option.categoryLabel}
                        getOptionLabel={(option) => option.label ?? ''}

                        inputValue={instrumentTypeSearchText}
                        onInputChange={(event, newInputValue) => {
                            setInstrumentTypeSearchText(newInputValue);
                        }}
                        value={enteredInstrumentType}
                        onChange={instrumentTypeChangeHandler}
                        renderInput={(params) => <TextField {...params} label="Instrument Type" />}

                    />
                </Form.Group>
            </div>
        </Fragment>
    )
};