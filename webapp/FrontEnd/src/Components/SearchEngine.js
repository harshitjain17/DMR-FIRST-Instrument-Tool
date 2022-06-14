import { Form, Container, Button, Row } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';

// import SearchableBar from './SearchableBar';

export default function SearchEngine(props) {

    const [enteredAddress, setEnteredAddress] = useState('');
    const [enteredDistance, setEnteredDistance] = useState('');
    const [enteredInstrumentType, setEnteredInstrumentType] = useState('');
    const [enteredAwardNumber, setEnteredAwardNumber] = useState('');
    const [enteredIRI, setEnteredIRI] = useState(false);

    const addressChangeHandler = (event) => {
        setEnteredAddress(event.target.value);
    };
    const distanceChangeHandler = (event) => {
        setEnteredDistance(event.target.value);
    };
    const instrumentTypeChangeHandler = (event) => {
        setEnteredInstrumentType(event.target.value);
    };
    const awardNumberChangeHandler = (event) => {
        setEnteredAwardNumber(event.target.value);
    };
    const IRIChangeHandler = () => {
        setEnteredIRI(!enteredIRI);
    };


    const submitHandler = (event) => {
        event.preventDefault();
        
        //Geocoding
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: enteredAddress,
                key: 'AIzaSyBWAhdwQk6dpFAjF4QcTfUo_pZH0n0Xgxk'
            }
        })
        .then(function(response){
            var lat = response.data.results[0].geometry.location.lat;
            var lng = response.data.results[0].geometry.location.lng;
            
            // Creating final object
            const userInput = {
                location: {
                    latitude: lat,
                    longitude: lng,
                    maxDistance: enteredDistance
                },
                instrumentType: enteredInstrumentType,
                awardNumber: enteredAwardNumber,
                includeRetired: enteredIRI
            };
            props.onSaveUserInput(userInput);
        })
        .catch(function(error){
            console.log(error);
        });
        
        setEnteredAddress('');
        setEnteredDistance('');
        setEnteredInstrumentType('');
        setEnteredAwardNumber('');
        setEnteredIRI('');
    };
    

    return (
        <Container className="w-50 p-3">
            <Form onSubmit={submitHandler}>
                
                <Row className = "mt-3">
                    <Form.Group controlId = "formAddress">
                        <Form.Label>Find Institutions near</Form.Label>
                        <Form.Control type="text" placeholder="Enter Location" onChange={addressChangeHandler} value = {enteredAddress}/>
                    </Form.Group>
                </Row>

                <Row className = "mt-3">
                    <Form.Group controlId = "formDistance">
                        <Form.Label>Maximum Distance</Form.Label>
                        <Form.Select aria-hidden="true" onChange={distanceChangeHandler} value = {enteredDistance}>
                            <option value="">Select distance...</option>
                            <option value="25">25 miles</option>
                            <option value="50">50 miles</option>
                            <option value="100">100 miles</option>
                            <option value="200">200 miles</option>
                            <option value="0">US</option>
                        </Form.Select>
                    </Form.Group>
                </Row>

                <Row className = "mt-3">
                    <Form.Group controlId = "formInstrumentType">
                        <Form.Label>Instrument Type</Form.Label>
                        <Form.Control type="search" placeholder="Enter technique"  onChange={instrumentTypeChangeHandler} value = {enteredInstrumentType}/>
                    </Form.Group>
                </Row>

                <Row className = "mt-3">
                    <Form.Group controlId = "formAwardNumber">
                        <Form.Label>Award Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter award number"  onChange={awardNumberChangeHandler} value = {enteredAwardNumber}/>
                    </Form.Group>
                </Row>
                
                <Row className = "mt-3">
                    <Form.Group className="mb-3" controlId="formIRI">
                        <Form.Check type="checkbox" label="Include retired instruments" onChange={IRIChangeHandler} value = {enteredIRI}/>
                    </Form.Group>
                </Row>

                <Row className="d-grid gap-2">
                    <Button type = 'submit' className = "mt-3"> Search </Button>
                </Row>
                
                <Row className="d-grid gap-2">
                    <Button variant="secondary" type="button" className = "mt-3">Reset</Button>
                </Row>
            </Form>
        </Container>
        
    );
};




// <div className="col-md-8">
//     <h4> Institutions near <span>University Park, PA</span></h4>
//     <div id="map" style= {{height: "380px", width: "100%", display: "none"}}></div>
//     <img style={{height: "380px", width: "100%"}} src="https://maps.googleapis.com/maps/api/staticmap?center=University+Park,PA&amp;zoom=7&amp;size=640x380&amp;maptype=roadmap&amp;markers=color:blue%7Clabel:S%7C40.802196,-77.859823&amp;key=AIzaSyANybCerdJ_PyJ-V3JKjXQqk871uvuQCK4&amp;signature=oYO-pmxJfAUNob1aIERy9y-agOU="/>
// </div>

// </div>

// <div className="row">
// <div id="InstitutionList_wrapper" className="dataTables_wrapper no-footer"><div className="dataTables_length" id="InstitutionList_length"><label>Show <select name="InstitutionList_length" aria-controls="InstitutionList" className=""><option value="5">5</option><option value="10">10</option><option value="20">20</option><option value="-1">All</option></select> entries</label></div><table id="InstitutionList" className="detail compact dataTable no-footer" cellspacing="0" width="100%" role="grid" aria-describedby="InstitutionList_info" style={{width: "100%"}}>
// <thead>
// <tr role="row"><th className="sorting_asc" tabindex="0" aria-controls="InstitutionList" rowspan="1" colspan="1" aria-sort="ascending" aria-label="
//     Label
// : activate to sort column descending" style={{width: "33px"}}>
//     <span className="hidden-xs">Label</span>
// </th><th className="sorting" tabindex="0" aria-controls="InstitutionList" rowspan="1" colspan="1" aria-label="
//     Distance [mi]
//     mi
// : activate to sort column ascending" style={{width: "52px"}}>
//     <span className="hidden-xs">Distance [mi]</span>
//     <span className="visible-xs">mi</span>
// </th><th className="sorting" tabindex="0" aria-controls="InstitutionList" rowspan="1" colspan="1" aria-label="Institution: activate to sort column ascending" style={{width: "61px"}}>Institution</th><th className="sorting" tabindex="0" aria-controls="InstitutionList" rowspan="1" colspan="1" aria-label="City: activate to sort column ascending" style={{width: "24px"}}>City</th><th className="sorting" tabindex="0" aria-controls="InstitutionList" rowspan="1" colspan="1" aria-label="
//     Doctoral1
//     className1
// : activate to sort column ascending" style={{width: "56px"}}>
//     <span className="hidden-xs">Doctoral<sup>1</sup></span>
//     <span className="visible-xs">className<sup>1</sup></span>
// </th><th className="sorting" tabindex="0" aria-controls="InstitutionList" rowspan="1" colspan="1" aria-label="PUI2: activate to sort column ascending" style={{width: "27px"}}>PUI<sup>2</sup></th><th className="sorting" tabindex="0" aria-controls="InstitutionList" rowspan="1" colspan="1" aria-label="MSI: activate to sort column ascending" style={{width: "24px"}}>MSI</th><th className="hidden-xs sorting" tabindex="0" aria-controls="InstitutionList" rowspan="1" colspan="1" aria-label="Enrollment: activate to sort column ascending" style={{width: "65px"}}>Enrollment</th><th className="hidden-xs sorting" tabindex="0" aria-controls="InstitutionList" rowspan="1" colspan="1" aria-label="classNameification: activate to sort column ascending" style={{width: "82px"}}>classNameification</th><th className="sorting_disabled" rowspan="1" colspan="1" aria-label="&amp;nbsp;" style={{width: "4px"}}>&nbsp;</th></tr>
// </thead>
// <tbody><tr className="odd"><td valign="top" colspan="10" className="dataTables_empty">No data available in table</td></tr></tbody></table><div className="dataTables_info" id="InstitutionList_info" role="status" aria-live="polite">Showing 0 to 0 of 0 entries</div><div className="dataTables_paginate paging_simple_numbers" id="InstitutionList_paginate"><a className="paginate_button previous disabled" aria-controls="InstitutionList" data-dt-idx="0" tabindex="-1" id="InstitutionList_previous">Previous</a><span></span><a className="paginate_button next disabled" aria-controls="InstitutionList" data-dt-idx="1" tabindex="-1" id="InstitutionList_next">Next</a></div></div>
// </div>
// </div>
