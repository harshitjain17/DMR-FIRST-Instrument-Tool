import { Form } from 'react-bootstrap';
import './SearchEngine.css';
import React, { useState, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

import InstoolApi from '../Api/InstoolApi';
// import GoogleApi from '../Api/GoogleApi';

import log from 'loglevel';

export default function SearchEngine(props) {

    // States for input given in the textbox (in search engine)
    const [enteredAddress, setEnteredAddress] = useState('');
    const [enteredDistance, setEnteredDistance] = useState('0');
    const [enteredInstrumentCategory, setEnteredInstrumentCategory] = useState('');
    const [instrumentTypeSearchText, setInstrumentTypeSearchText] = useState('');
    const [enteredInstrumentType, setEnteredInstrumentType] = useState(null);
    const [enteredKeywords, setEnteredKeywords] = useState([]);
    const [enteredManufacturer, setEnteredManufacturer] = useState('');
    const [enteredAwardNumber, setEnteredAwardNumber] = useState('');
    const [enteredIRI, setEnteredIRI] = useState(false);

    // States for dropdowns (in search engine)
    const [instrumentCategories, setInstrumentCategories] = useState([]);
    const [instrumentTypes, setInstrumentTypes] = useState([]);

    const addressChangeHandler = (event) => {
        setEnteredAddress(event.target.value);
    };

    const distanceChangeHandler = (event) => {
        setEnteredDistance(event.target.value);
    };

    const instrumentCategoryChangeHandler = (event) => {
        setEnteredInstrumentCategory(event.target.value);
    };

    const instrumentTypeChangeHandler = (event, option) => {
        setEnteredInstrumentType(option);
    };

    const keywordsChangeHandler = (event) => {
        enteredKeywords.push(event.target.value);
        setEnteredKeywords(enteredKeywords);
    };

    const manufacturerChangeHandler = (event) => {
        setEnteredManufacturer(event.target.value);
    };

    const awardNumberChangeHandler = (event) => {
        setEnteredAwardNumber(event.target.value);
    };

    const IRIChangeHandler = () => {
        setEnteredIRI(!enteredIRI);
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
        };
        fetchData();
    }, [enteredInstrumentCategory]); // dependent on category selected

    // typography
    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        textAlign: 'center'
    }));

    // We only search once the user hits submit - handled here
    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            var result = enteredAddress ? await InstoolApi.get(`/locate?address=${enteredAddress}`) : undefined;
            var coordinates = result ? result.data : {
                latitude: 37,
                longitude: -95
            };

            log.info(`Found coordinates (${coordinates.latitude}, ${coordinates.longitude}) for ${enteredAddress}`);

            // search criteria as expected by the server
            const userInput = {
                location: {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    maxDistance: enteredDistance
                },
                instrumentType: enteredInstrumentType?.value ?? enteredInstrumentCategory,
                keywords: enteredKeywords,
                manufacturer: enteredManufacturer,
                awardNumber: enteredAwardNumber,
                includeRetired: enteredIRI
            };

            log.debug(userInput);

            const response = await InstoolApi.post(`/instruments/search`, userInput);
            log.info(`Server returned ${response.data.instruments?.length} instruments, and ${response.data.locations?.length} locations`)
            log.debug(response);
            // Let other components update using both the results we got from the server,
            // as well as the search location, which is needed to center the map
            props.onSaveResponseData({
                instruments: response.data.instruments,
                locations: response.data.locations,
                searchLocation: userInput.location
            })
        } catch (error) {
            log.error(error);
            throw error;
        }
    };

    // Another Submit handler (for handling loading states)
    // const [minimumTime, setMinimumTime] = useState(500);
    const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(true);
    const [loading, setLoading] = useState(false);

    const restartTimeout = useCallback(() => {
        setMinimumTimeElapsed(false);
        setLoading(true);
        const randomLoadTime = 4000;

        setTimeout(() => {
            setMinimumTimeElapsed(true);
        }, 500);

        setTimeout(() => {
            setLoading(false);
        }, randomLoadTime);

    }, [setMinimumTimeElapsed, setLoading]);

    React.useEffect(() => {
        props.minimumTimeElapsed(minimumTimeElapsed);
        props.loading(loading);
    }, [props, minimumTimeElapsed, loading]);

    // Reset handling
    const resetHandler = async (event) => {
        event.preventDefault();

        setEnteredAddress('');
        setEnteredDistance('0');
        setEnteredInstrumentCategory('');
        setEnteredInstrumentType(null);
        setEnteredKeywords([]);
        setEnteredManufacturer('');
        setEnteredAwardNumber('');
        setEnteredIRI(false);
    };

    return (

        <div className="px-3 border" style={{ width: "100%", height: "100%" }}>
            <Form onSubmit={submitHandler} onReset={resetHandler} style={{ width: "100%", height: "100%" }}>
                <Div>{"SEARCH TOOL"}</Div>
                <div>
                    <Form.Group controlId="formAddress">
                        <TextField
                            fullWidth={true}
                            size="small"
                            onChange={addressChangeHandler}
                            value={enteredAddress}
                            label="Find instruments near"
                            variant="outlined"
                        />
                    </Form.Group>
                </div>


                <div className="mt-3">
                    <Form.Group controlId="formDistance">
                        <TextField
                            fullWidth={true}
                            size="small"
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
                    </Form.Group>
                </div>

                <div className="mt-3">
                    <Form.Group controlId="formInstrumentCategory">
                        <TextField
                            options={instrumentCategories}
                            fullWidth={true}
                            size="small"
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

                <div className="mt-3">
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
                            size="small"
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


                <div className="mt-3">
                    <Form.Group controlId="formKeywords">
                        <Autocomplete
                            multiple
                            fullWidth={true}
                            size="small"
                            options={[]}
                            freeSolo
                            onChange={keywordsChangeHandler}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip size="small" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Capabilities description keywords"
                                />
                            )}

                        />
                    </Form.Group>
                </div>


                <div className="mt-3">
                    <Form.Group controlId="formManufacturer">
                        <TextField
                            fullWidth={true}
                            size="small"
                            onChange={manufacturerChangeHandler}
                            value={enteredManufacturer}
                            label="Manufacturer"
                            variant="outlined"

                        />
                    </Form.Group>
                </div>


                <div className="mt-3">
                    <Form.Group controlId="formAwardNumber">
                        <TextField
                            fullWidth={true}
                            size="small"
                            value={enteredAwardNumber}
                            onChange={awardNumberChangeHandler}
                            label="Award Number"
                            variant="outlined"

                        />
                    </Form.Group>
                </div>

                <div className="mt-3">
                    <Form.Group className="mb-1" controlId="formIRI">
                        <FormControlLabel control={
                            <Checkbox
                                checked={enteredIRI}
                                onChange={IRIChangeHandler}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        } label="Include retired instruments"
                        />
                    </Form.Group>
                </div>


                <div className="d-grid gap-2 mt-3">
                    <Button endIcon={<SearchIcon />} onClick={() => { restartTimeout() }} type='submit' variant="contained" style={{ width: "90%", margin: "auto" }}>Search</Button>
                </div>

                <div className="d-grid gap-2">
                    <Button variant="secondary" type="reset" className="mt-2" style={{ width: "90%", margin: "auto" }}>Reset</Button>
                </div>
            </Form>
        </div>

    );
};