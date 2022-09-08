import { Form } from 'react-bootstrap';

import './SearchEngine.css';
import React, { useState, useCallback, FormEventHandler } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import useMediaQuery from '@mui/material/useMediaQuery';

import { DeviceLocation } from '../SearchFields/DeviceLocation';
import { InstrumentTypeDropDowns } from '../SearchFields/InstrumentTypeDropdowns';
import LocationApi from "../../Api/LocationApi";
import InstrumentApi from "../../Api/InstrumentApi";

import log from 'loglevel';
import { LocationResult, InstrumentRow, SearchLocation, InstrumentTypeDropdownEntry, InstrumentSearchCriteria } from '../../Api/Model';
import { SearchAddressField, DistanceField } from '../SearchFields/LocationFields';
import { KeywordsField } from '../SearchFields/KeywordsField';
import { AwardField } from '../SearchFields/AwardField';
import { FilterByStatus } from '../SearchFields/FilterByStatus';

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
            let location: SearchLocation | undefined = undefined;
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
            const userInput: InstrumentSearchCriteria = {
                location: location,
                instrumentType: enteredInstrumentType?.shortname ?? enteredInstrumentCategory ?? undefined,
                keywords: enteredKeywords,
                manufacturerOrModel: enteredManufacturer,
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



    return (
        <div className="px-3 search-engine">
            <Form onSubmit={submitHandler} onReset={resetHandler}>
                <SearchToolHeader>{"SEARCH TOOL"}</SearchToolHeader>

                <DeviceLocation onAddressFound={setEnteredAddress} />

                <SearchAddressField address={enteredAddress} onAddressChanged={setEnteredAddress} xlargeScreen={xlargeScreen} distance={enteredDistance} />

                <DistanceField distance={enteredDistance} onDistanceChanged={setEnteredDistance} xlargeScreen={xlargeScreen} />

                <InstrumentTypeDropDowns
                    xlargeScreen={xlargeScreen}
                    instrumentCategory={enteredInstrumentCategory}
                    instrumentType={enteredInstrumentType}
                    onInstrumentCategorySelected={setEnteredInstrumentCategory}
                    onInstrumentTypeSelected={setEnteredInstrumentType} />

                <KeywordsField keywords={enteredKeywords} onKeywordsChanged={setEnteredKeywords} xlargeScreen={xlargeScreen}/>

                <AwardField awardNumber={enteredAwardNumber} onAwardNumberChanged={setEnteredAwardNumber} xlargeScreen={xlargeScreen}/>

                {/* <FilterByStatus includeRetired={enteredIRI} onIncludeRetiredrChanged={setEnteredIRI} xlargeScreen={xlargeScreen} /> */}
 
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