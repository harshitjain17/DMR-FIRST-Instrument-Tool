import { Form } from 'react-bootstrap';

import './SearchEngine.css';
import React, { useState, useCallback, FormEventHandler } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import useMediaQuery from '@mui/material/useMediaQuery';

import DeviceLocation from './DeviceLocation';
import InstrumentTypeDropDowns from './InstrumentTypeDropdowns';
import LocationApi from "../../Api/LocationApi";
import InstrumentApi from "../../Api/InstrumentApi";

import log from 'loglevel';
import { LocationResult, InstrumentRow, SearchLocation, InstrumentTypeDropdownEntry} from '../../Api/Model';

export interface SearchResponse {
    instruments: InstrumentRow[],
    locations: LocationResult[],
    searchLocation?: SearchLocation
}

interface ISearchEngineProps {
    onSearchResponseAvailable: (response: SearchResponse) => void,
    onMinimumTimeElapsed: (isLoading: boolean) => void,
    onSetLoading: (isLoading: boolean) => void
}


export default function SearchEngine({ onSearchResponseAvailable, onMinimumTimeElapsed, onSetLoading }: ISearchEngineProps) {

    // States for input given in the textbox (in search engine)
    const [enteredAddress, setEnteredAddress] = useState<string>('');
    const [enteredDistance, setEnteredDistance] = useState<string>('0');
    const [enteredInstrumentCategory, setEnteredInstrumentCategory] = useState<string | null>('');
    const [enteredInstrumentType, setEnteredInstrumentType] = useState<InstrumentTypeDropdownEntry | null>(null);
    const [enteredKeywords, setEnteredKeywords] = useState<string[]>([]);
    const [enteredManufacturer, setEnteredManufacturer] = useState<string>('');
    const [enteredAwardNumber, setEnteredAwardNumber] = useState<string>('');
    const [enteredIRI, setEnteredIRI] = useState<boolean>(false);

    const addressChangeHandler = (event: any) => {
        setEnteredAddress(event.target.value);
    };

    const distanceChangeHandler = (event: any) => {
        setEnteredDistance(event.target.value);
    };

    const keywordsChangeHandler = (event: any) => {
        enteredKeywords.push(event.target.value);
        setEnteredKeywords(enteredKeywords);
    };

    const manufacturerChangeHandler = (event: any) => {
        setEnteredManufacturer(event.target.value);
    };

    const awardNumberChangeHandler = (event: any) => {
        setEnteredAwardNumber(event.target.value);
    };

    const IRIChangeHandler = () => {
        setEnteredIRI(!enteredIRI);
    };


    // typography
    const SearchToolHeader = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        textAlign: 'center',
        fontSize: xlargeScreen ? 25 : 14,
        paddingBottom: 1
    }));

    // We only search once the user hits submit - handled here
    const submitHandler: FormEventHandler = async (event) => {
        event.preventDefault();
        try {
            let location : SearchLocation | undefined = undefined;
            if (enteredAddress) {
                const coord = await LocationApi.getCoordinates(enteredAddress);
                location = {
                    address: enteredAddress,
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                    maxDistance: Number(enteredDistance)
                };
                log.info(`Found coordinates (${location.latitude}, ${location.longitude}) for ${enteredAddress}`);
            }

            // search criteria as expected by the server
            const userInput = {
                location: location,
                instrumentType: enteredInstrumentType?.shortname ?? enteredInstrumentCategory ?? undefined,
                keywords: enteredKeywords,
                manufacturer: enteredManufacturer,
                awardNumber: enteredAwardNumber,
                includeRetired: enteredIRI
            };

            log.debug(userInput);

            const response = await InstrumentApi.search(userInput);

            // Let other components update using both the results we got from the server,
            // as well as the search location, which is needed to center the map
            onSearchResponseAvailable({
                instruments: response.instruments,
                locations: response.locations,
                searchLocation: userInput.location
            })
        } catch (error) {
            log.error(error);
            throw error;
        }
    };

    // Another Submit handler (for handling loading states)
    const [isMinimumTimeElapsed, setMinimumTimeElapsed] = useState(true);
    const [isLoading, setLoading] = useState(false);

    const restartTimeout = useCallback(() => {
        setMinimumTimeElapsed(false);
        setLoading(true);
        const randomLoadTime = 400;

        setTimeout(() => {
            setMinimumTimeElapsed(true);
        }, 500);

        setTimeout(() => {
            setLoading(false);
        }, randomLoadTime);

    }, []);

    React.useEffect(() => {
        onMinimumTimeElapsed(isMinimumTimeElapsed);
        onSetLoading(isLoading);
    }, [onMinimumTimeElapsed, onSetLoading, isMinimumTimeElapsed, isLoading]);

    // Reset handling
    const resetHandler = async (event: React.SyntheticEvent) => {
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

    // breakpoints for responsiveness
    const xlargeScreen = useMediaQuery('(min-width:2560px)');
 
    // focus states for helper text (below input boxes)
    const [focus1, setFocus1] = useState(false);
    const [focus2, setFocus2] = useState(false);
    const [focus5, setFocus5] = useState(false);
    const [focus6, setFocus6] = useState(false);
    const [focus7, setFocus7] = useState(false);


    return (
        <div className="px-3 border search-engine">
            <Form onSubmit={submitHandler} onReset={resetHandler}>
                <SearchToolHeader>{"SEARCH TOOL"}</SearchToolHeader>
                <DeviceLocation onAddressFound={setEnteredAddress} />
                
                <div>
                    <TextField
                        id="formAddress"
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        onChange={addressChangeHandler}
                        value={enteredAddress}
                        label="Find instruments near"
                        variant="outlined"
                        onFocus={() => {setFocus1(true)}}
                        onBlur={() => {setFocus1(false)}}
                        helperText={ focus1 ? "Enter the location near which you want to search for the instrument." : "" }
                        required={enteredDistance !== '0'}
                        data-error="Required when maximum Distance is set"
                    />
                </div>


                <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                    <TextField
                        id="formDistance"
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        select
                        label="Maximum Distance"
                        value={enteredDistance}
                        onChange={distanceChangeHandler}
                        onFocus={() => {setFocus2(true)}}
                        onBlur={() => {setFocus2(false)}}
                        helperText={ focus2 ? "Select the distance radius." : "" }
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

                <InstrumentTypeDropDowns
                    xlargeScreen={xlargeScreen}
                    enteredInstrumentCategory={enteredInstrumentCategory}
                    enteredInstrumentType={enteredInstrumentType}
                    onInstrumentCategorySelected={setEnteredInstrumentCategory}
                    onInstrumentTypeSelected={setEnteredInstrumentType} />


                <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                    <Autocomplete
                        id="formKeywords"
                        multiple
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        options={[]}
                        freeSolo
                        onChange={keywordsChangeHandler}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip size={xlargeScreen ? "medium" : "small"} label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Capabilities description keywords"
                                onFocus={() => {setFocus5(true)}}
                                onBlur={() => {setFocus5(false)}}
                                helperText={ focus5 ? "Enter any keywords which you think may be present in the description of the instrument." : "" }
                            />
                        )}

                    />
                </div>


                <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                    <TextField
                        id="formManufacturer"
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        onChange={manufacturerChangeHandler}
                        value={enteredManufacturer}
                        label="Manufacturer / Model"
                        variant="outlined"
                        onFocus={() => {setFocus6(true)}}
                        onBlur={() => {setFocus6(false)}}
                        helperText={ focus6 ? "Enter the exact manufacturer/model (optional). You can also search all instruments from the same manufacturer." : "" }
                    />
                </div>


                <div className={xlargeScreen ? "mt-4" : "mt-3"}>
                    <TextField
                        id="formAwardNumber"
                        fullWidth={true}
                        size={xlargeScreen ? "medium" : "small"}
                        value={enteredAwardNumber}
                        onChange={awardNumberChangeHandler}
                        label="Award Number"
                        variant="outlined"
                        onFocus={() => {setFocus7(true)}}
                        onBlur={() => {setFocus7(false)}}
                        helperText={ focus7 ? "Enter the exact award number (optional)." : "" }
                    />
                </div>

                <div className={xlargeScreen ? "mt-4" : "mt-2"}>
                    <Form.Group className="mb-1" controlId="formIRI">
                        <FormControlLabel
                            id="formIRI"
                            control={
                                <Checkbox
                                    checked={enteredIRI}
                                    onChange={IRIChangeHandler}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                            label="Include retired instruments"
                        />
                    </Form.Group>
                </div>


                <div className={xlargeScreen ? "d-grid gap-2 mt-3" : "d-grid gap-2 mt-3"}>
                    <Button size={xlargeScreen ? "large" : "medium"}
                        startIcon={<SearchIcon />}
                        onClick={() => { restartTimeout() }}
                        type='submit' variant="contained"
                        style={{ width: "100%", margin: "auto" }}>Search</Button>
                </div>

                <div className={xlargeScreen ? "d-grid gap-2 mt-3" : "d-grid gap-2 mt-1"}>
                    <Button size={xlargeScreen ? "large" : "medium"}
                        startIcon={<RestartAltIcon />}
                        type="reset"
                        className="mt-2"
                        style={{ width: "100%", margin: "auto" }}>Reset</Button>
                </div>
            </Form>
        </div>

    );
}