import React, { Fragment, useState } from 'react';
import { Form } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';

import InstrumentTypeApi from '../../Api/InstrumentTypeApi';
import { InstrumentType, InstrumentTypeDropdownEntry } from '../../Api/Model';
import { getInstrumentTypeLabel } from '../../Api/ModelUtils';
import Tooltip from '@mui/material/Tooltip';

// We do need <null> here instead of <undefined>, the MUI autocompleted
// only allows <null> set reset the field, whereas <undefined> would switch to uncontrolled mode,
// where users can enter any value.  
interface IInstrumentTypeDropdownProps {
    xlargeScreen: boolean,
    instrumentCategory: string | null,
    instrumentType: InstrumentTypeDropdownEntry | null,
    onInstrumentCategorySelected: (value: string | null) => void,
    onInstrumentTypeSelected: (value: InstrumentTypeDropdownEntry | null) => void
}

export function InstrumentTypeDropDowns({
    xlargeScreen,
    instrumentCategory, instrumentType,
    onInstrumentCategorySelected, onInstrumentTypeSelected }: IInstrumentTypeDropdownProps) {

    const [instrumentCategories, setInstrumentCategories] = useState<InstrumentType[]>([]);
    const [instrumentTypes, setInstrumentTypes] = useState<InstrumentTypeDropdownEntry[]>([]);
    const [instrumentTypeSearchText, setInstrumentTypeSearchText] = useState<string>('');

    // focus states for helper text (below input boxes)
    const [categoryFocused, setCategoryFocues] = useState(false);
    const [typeFocused, setTypeFocused] = useState(false);

    const instrumentCategoryChangeHandler = (event: any) => {
        onInstrumentCategorySelected(event.target.value);
    };

    const instrumentTypeChangeHandler = (event: React.SyntheticEvent, option: any) => {
        onInstrumentTypeSelected(option);
    };

    // Instrument Categories Dropdown List
    React.useEffect(() => {
        InstrumentTypeApi
            .getCategories()
            .then((response) => setInstrumentCategories(response));
    }, []);

    // Autocompletion of instrument types
    React.useEffect(() => {
        InstrumentTypeApi
            .getDropdownEntries(instrumentCategory)
            .then((types) => setInstrumentTypes(types));
    }, [instrumentCategory, onInstrumentTypeSelected]); // dependent on category selected

    return (
        <Fragment>
            <Tooltip title="Select an instrument category, and show instrument types grouped by techniques in that category.">
                <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                    <Form.Group controlId="formInstrumentCategory">
                        <TextField
                            fullWidth={true}
                            size={xlargeScreen ? "medium" : "small"}
                            select
                            label="Instrument Category"
                            value={instrumentCategory}
                            onChange={instrumentCategoryChangeHandler}
                            onFocus={() => { setCategoryFocues(true) }}
                            onBlur={() => { setCategoryFocues(false) }}
                            helperText={categoryFocused ? "Select an instrument category, and show instrument types grouped by techniques in that category." : ""}
                        >
                            {instrumentCategories.map((option) => (
                                <MenuItem key={option.instrumentTypeId} value={option.name}>
                                    {getInstrumentTypeLabel(option)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Form.Group>
                </div>
            </Tooltip>

            <Tooltip title="Select an instrument type, i.e. the instrument technique.">
                <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                    <Form.Group controlId="formInstrumentType">
                        <Autocomplete
                            key={instrumentCategory}
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
                            value={instrumentType}
                            onChange={instrumentTypeChangeHandler}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Instrument Type"
                                    onFocus={() => { setTypeFocused(true) }}
                                    onBlur={() => { setTypeFocused(false) }}
                                    helperText={typeFocused ? "Select an instrument type, i.e. the instemnt technique." : ""}
                                />}

                        />
                    </Form.Group>
                </div>
            </Tooltip>
        </Fragment>
    )
}