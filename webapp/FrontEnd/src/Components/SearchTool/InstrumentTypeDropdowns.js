import React, { Fragment, useState} from 'react';
import { Form } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';

import InstoolApi from '../../Api/InstoolApi';

export default function InstrumentTypeDrowns({ 
    xlargeScreen, 
    enteredInstrumentCategory, enteredInstrumentType,
    onInstrumentCategorySelected, onInstrumentTypeSelected}) {

    const [instrumentCategories, setInstrumentCategories] = useState([]);
    const [instrumentTypes, setInstrumentTypes] = useState([]);
    const [instrumentTypeSearchText, setInstrumentTypeSearchText] = useState('');

    
    const instrumentCategoryChangeHandler = (event) => {
        onInstrumentCategorySelected(event.target.value);
    };

    const instrumentTypeChangeHandler = (event, option) => {
        onInstrumentTypeSelected(option);
    };

    // Instrument Categories Dropdown List
    React.useEffect(() => {
        InstoolApi.get(`/instrument-types`).then((response) => {
            setInstrumentCategories(response.data);
        });
    }, []);

    // Autocompletion of instrument types
    React.useEffect(() => {
        const fetchData = async () => {
            const response = enteredInstrumentCategory ?
                // Case - I (If the user selected the category)
                await InstoolApi.get(`/instrument-types/${enteredInstrumentCategory}/dropdown`) :
                // Case - II (If the user did not selected the category)
                await InstoolApi.get(`/instrument-types/dropdown`);

            setInstrumentTypes(response.data);
            onInstrumentTypeSelected(null);
        };
        fetchData();
    }, [enteredInstrumentCategory, onInstrumentTypeSelected]); // dependent on category selected


    return (
        <Fragment>
            <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                <Form.Group controlId="formInstrumentCategory">
                    <TextField
                        options={instrumentCategories}
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        select
                        label="Instrument Category"
                        value={enteredInstrumentCategory}
                        onChange={instrumentCategoryChangeHandler}
                    >
                        {instrumentCategories.map((option) => (
                            <MenuItem key={option.name} value={option.name}>
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