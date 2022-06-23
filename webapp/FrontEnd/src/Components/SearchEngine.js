import { Form, Row } from 'react-bootstrap';
import './SearchEngine.css';
import React, { useState } from 'react';
import axios from 'axios';
import InstrumentTypeList from './InstrumentTypeList.json';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';


export default function SearchEngine(props) {

    const [enteredAddress, setEnteredAddress] = useState('');
    const [enteredDistance, setEnteredDistance] = useState('');
    const [enteredInstrumentType, setEnteredInstrumentType] = useState('');
    const [enteredKeywords, setEnteredKeywords] = useState([]);
    const [enteredManufacturer, setEnteredManufacturer] = useState('');
    const [enteredAwardNumber, setEnteredAwardNumber] = useState('');
    const [enteredIRI, setEnteredIRI] = useState(false);

    const addressChangeHandler = (event) => {
        setEnteredAddress(event.target.value);
    };

    const distanceChangeHandler = (event) => {
        setEnteredDistance(event.target.value);
    };

    const instrumentTypeChangeHandler = (event, value) => {
        setEnteredInstrumentType(value);
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

    async function Geocoding() {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: enteredAddress,
                    key: 'AIzaSyBWAhdwQk6dpFAjF4QcTfUo_pZH0n0Xgxk'
                }
            })
            var lat = response.data.results[0].geometry.location.lat;
            var lng = response.data.results[0].geometry.location.lng;
            return [lat, lng];
        
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    }));

    const submitHandler = async (event) => {
        event.preventDefault();
      
        var coordinates = await Geocoding();
      
        const userInput = { //object
            location: {
                latitude: coordinates[0],
                longitude: coordinates[1],
                maxDistance: enteredDistance
            },
            instrumentType: enteredInstrumentType,
            keywords: enteredKeywords,
            manufacturer: enteredManufacturer,
            awardNumber: enteredAwardNumber,
            includeRetired: enteredIRI
        };
        props.onSaveUserInput(userInput);
    };

    const resetHandler = async (event) => {
        event.preventDefault();

        setEnteredAddress('');
        setEnteredDistance('');
        setEnteredInstrumentType('');
        setEnteredKeywords([]);
        setEnteredManufacturer('');
        setEnteredAwardNumber('');
        setEnteredIRI(false);
    };

    return (

        <div className="px-3 border" style={{width: "100%", height: "102%"}}>
            <Div>{"SEARCH TOOL"}</Div>
            <Form onSubmit={submitHandler} onReset={resetHandler} style={{width: "100%", height: "100%"}}>
                <Row>
                    <Form.Group controlId = "formAddress">
                        <TextField
                            required
                            fullWidth
                            size="small"
                            onChange={addressChangeHandler}
                            value = {enteredAddress} 
                            label="Find instruments near" 
                            variant="outlined"
                            />
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group controlId = "formDistance">
                        <TextField
                            fullWidth
                            size="small"
                            select
                            label="Maximum Distance"
                            value = {enteredDistance}
                            onChange={distanceChangeHandler}
                            margin="normal"
                        >
                            <MenuItem key = "25" value = "25">25 miles</MenuItem>
                            <MenuItem key = "50" value = "50">50 miles</MenuItem>
                            <MenuItem key = "75" value = "75">75 miles</MenuItem>
                            <MenuItem key = "100" value = "100">100 miles</MenuItem>
                            <MenuItem key = "150" value = "150">150 miles</MenuItem>
                            <MenuItem key = "200" value = "200">200 miles</MenuItem>
                            <MenuItem key = "0" value = "0">US</MenuItem>
                        </TextField>
                    </Form.Group>
                </Row>

                <Row className = "mt-2">
                    <Form.Group controlId = "formInstrumentType">
                        <Autocomplete
                            fullwidth
                            size="small"
                            options={InstrumentTypeList.sort((a, b) =>
                                b.technique.localeCompare(a.technique.toString())
                              )}
                            groupBy={(option) => option.technique}
                            getOptionLabel={(option) => option.value}
                            inputValue = {enteredInstrumentType}
                            onInputChange = {instrumentTypeChangeHandler}
                            renderInput={(params) => <TextField {...params} label="Instrument Type"/>}
                            margin="normal"
                        />
                    </Form.Group>
                </Row>

                <Row className = "mt-3">
                    <Form.Group controlId = "formKeywords">
                        <Autocomplete
                            multiple
                            fullwidth
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
                            margin="normal"
                        />
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group controlId = "formManufacturer">
                        <TextField
                            fullWidth
                            size="small"
                            onChange={manufacturerChangeHandler}
                            value={enteredManufacturer}
                            label="Manufacturer" 
                            variant="outlined"
                            margin="normal"
                        />
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group controlId = "formAwardNumber">
                        <TextField
                            fullWidth
                            size="small"
                            value={enteredAwardNumber}
                            onChange={awardNumberChangeHandler}
                            label="Award Number" 
                            variant="outlined"
                            margin="normal"
                        />
                    </Form.Group>
                </Row>
                
                <Row>
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
                </Row>

                <Row className="d-grid gap-2 mt-3">
                    <Button type = 'submit' variant="contained" style = {{width:"90%", margin: "auto"}}>Search</Button>
                </Row>
                
                <Row className="d-grid gap-2">
                    <Button variant="secondary" type="reset" className = "mt-2" style = {{width:"90%", margin: "auto"}}>Reset</Button>
                </Row>
            </Form>
        </div>
        
    );
};