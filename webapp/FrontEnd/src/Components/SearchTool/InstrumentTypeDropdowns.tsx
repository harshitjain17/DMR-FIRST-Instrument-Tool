import React, { Fragment, useState } from 'react';
import { Form } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';

import InstrumentTypeApi from '../../Api/InstrumentTypeApi';
import { InstrumentType, InstrumentTypeDropdownEntry } from '../../Api/Model';
import { getInstrumentTypeLabel } from '../../Api/ModelUtils';

// We do need <null> here instead of <undefined>, the MUI autocompleted
// only allows <null> set reset the field, whereas <undefined> would switch to uncontrolled mode,
// where users can enter any value.  
interface IInstrumentTypeDropdownProps {
    xlargeScreen: boolean,
    enteredInstrumentCategory: string | null,
    enteredInstrumentType: InstrumentTypeDropdownEntry | null,
    onInstrumentCategorySelected: (value: string | null) => void,
    onInstrumentTypeSelected: (value: InstrumentTypeDropdownEntry | null) => void
}

export default function InstrumentTypeDrowns({
    xlargeScreen,
    enteredInstrumentCategory, enteredInstrumentType,
    onInstrumentCategorySelected, onInstrumentTypeSelected }: IInstrumentTypeDropdownProps) {

    const [instrumentCategories, setInstrumentCategories] = useState<InstrumentType[]>([]);
    const [instrumentTypes, setInstrumentTypes] = useState<InstrumentTypeDropdownEntry[]>([]);
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
            onInstrumentTypeSelected(null);
        };
        fetchData();
    }, [enteredInstrumentCategory, onInstrumentTypeSelected]); // dependent on category selected

    // focus states for helper text (below input boxes)
    const [focus3, setFocus3] = useState(false);
    const [focus4, setFocus4] = useState(false);

    return (
        <Fragment>
            <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                <Form.Group controlId="formInstrumentCategory">
                    <TextField
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        select
                        label="Instrument Category"
                        value={enteredInstrumentCategory}
                        onChange={instrumentCategoryChangeHandler}
                        onFocus={() => {setFocus3(true)}}
                        onBlur={() => {setFocus3(false)}}
                        helperText={ focus3 ? "Select the category (optional). If you do not select category here, then you can browse all techniques in the next Textfield. " : "" }
                    >
                        {instrumentCategories.map((option) => (
                            <MenuItem key={option.instrumentTypeId} value={option.name}>
                                {getInstrumentTypeLabel(option)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Form.Group>
            </div>

            <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                <Form.Group controlId="formInstrumentType">
                    <Autocomplete 
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        options={instrumentTypes}
                        isOptionEqualToValue={(option, value) => option?.shortname === value?.shortname}
                        groupBy={(option) => option.categoryLabel}
                        getOptionLabel={(option) => getInstrumentTypeLabel(option)}

                        inputValue={instrumentTypeSearchText}
                        onInputChange={(event, newInputValue) => {
                            setInstrumentTypeSearchText(newInputValue);
                        }}
                        value={enteredInstrumentType}
                        onChange={instrumentTypeChangeHandler}
                        renderInput={(params) => 
                        <TextField
                            {...params}
                            label="Instrument Type"
                            onFocus={() => {setFocus4(true)}}
                            onBlur={() => {setFocus4(false)}}
                            helperText={ focus4 ? "Select the instrument technique (recommended)." : "" }
                        />}

                    />
                </Form.Group>
            </div>
        </Fragment>
    )
}