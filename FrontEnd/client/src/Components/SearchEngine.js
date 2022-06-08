import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';

export default function SearchEngine(props) {

    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    

    const emailChangeHandler = (event) => {
        setEnteredEmail(event.target.value);
    };
    const passwordChangeHandler = (event) => {
        setEnteredPassword(event.target.value);
    };


    const submitHandler = (event) => {
        event.preventDefault();
        
        const userInput = { //object
            email: enteredEmail,
            password: enteredPassword
        };
        props.onSaveUserInput(userInput);
        setEnteredEmail('');
        setEnteredPassword('');
    };
    

    return (
        <Container>
            <Form onSubmit={submitHandler}>
                <Row>
                    <Col md>
                        <Form.Group controlId = "formEmail">
                            <Form.Label >Email Address</Form.Label>
                            <Form.Control type="email" placeholder = "example@email.com" onChange={emailChangeHandler} value = {enteredEmail}/>
                        </Form.Group>
                    </Col>
                
                    <Col md>
                        <Form.Group controlId = "formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder = "password" onChange={passwordChangeHandler} value = {enteredPassword}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Button type = 'submit' className = "mt-3"> Search </Button>
            </Form>
        </Container>
        
    );
};
// onSubmit = {(event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const data = Object.fromEntries(formData.entries());
//     console.log(data);
// }}


// className="btnFormSend" variant="outline-success" onClick={this.onSubmit}




// value={this.state.val}
//                                 onChange={e => this.setState({ val: e.target.value })}


// <div className="container">
// <div className="row">
                





// <form className="form-horizontal form-condensed" onsubmit="return false">
//     <fieldset className="col-md-4 form-horizontal">
        

//         <div className="form-group" title="Please enter either a location name or a zip code">
//             <label className="control-label" for="searchAddress">Find Institutions near</label>
//             <input type="text" name="searchAddress" className="form-control" placeholder="Enter Location" title="Please enter either a location name or a zip code"/><span className="has-error" style={{display: "none;"}}></span>
//         </div>
        

//         <div className="form-group">
//             <label className="control-label" for="maxDist">Maximum Distance</label>
//             <select className="form-control select2-hidden-accessible" name="maxDist" data-select2-id="1" tabindex="-1" aria-hidden="true">
//                 <option value="25" data-select2-id="3">25 miles</option>
//                 <option value="50">50 miles</option>
//                 <option value="100">100 miles</option>
//                 <option value="200">200 miles</option>
//                 <option value="0">US</option>
//             </select>
//             <span className="select2 select2-container select2-container--bootstrap" dir="ltr" data-select2-id="2" style={{width: "100%"}}>
//                 <span className="selection">
//                     <span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-maxDist-2y-container">
//                         <span className="select2-selection__rendered" id="select2-maxDist-2y-container" role="textbox" aria-readonly="true" title="25 miles">25 miles</span>
//                         <span className="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>
//                     </span>
//                 </span>
//                 <span className="dropdown-wrapper" aria-hidden="true"></span>
//             </span>
//         </div>
        

//         <div className="form-group">
//             <label className="control-label" for="selectedFields">Prioritize by research fields</label>
//             <select className="form-control select2-hidden-accessible" name="selectedFields" multiple="" data-select2-id="4" tabindex="-1" aria-hidden="true">
//                 <optgroup label="Engineering">
//                     <option value="20">Aerospace engineering</option>                            
//                     <option value="21">Bioengineering</option>                            
//                     <option value="22">Chemical engineering</option>                            
//                     <option value="23">Civil engineering</option>                            
//                     <option value="24">Electrical &amp; electronic engineering</option>                            
//                     <option value="25">Industrial engineering</option>                            
//                     <option value="26">Mechanical engineering</option>                            
//                     <option value="27">Metallurgical and materials engineering</option>                            
//                     <option value="28">Engineering, n.e.c.  </option>
//                 </optgroup>
        
//                 <optgroup label="Geosciences">
//                     <option value="1">Atmospheric sciences</option>
//                     <option value="2">Gelogical sciences</option>                        
//                     <option value="3">Ocean sciences</option>                        
//                     <option value="4">Geosciences, n.e.c.</option>
//                 </optgroup>
    
//                 <optgroup label="Computer and information scienc">
//                     <option value="29">Computer and information science</option>
//                 </optgroup>
    
//                 <optgroup label="Life Sciences">
//                     <option value="5">Agricultural sciences</option>
                
//                     <option value="6">Biological and biomedical sciences</option>
                
//                     <option value="7">Heal sciences</option>
                
//                     <option value="8">Natural resources</option>
                
//                     <option value="9">Life sciences, n.e.c.</option>
//                 </optgroup>
    
//                 <optgroup label="Mathematics">
//                     <option value="30">Mathematics and statistics</option>
//                 </optgroup>
        
//                 <optgroup label="All non-S&amp;E fields">
//                     <option value="33">All non-S&amp;E fields</option>
//                 </optgroup>
        
//                 <optgroup label="Sciences, n.e.c.">
//                     <option value="32">Sciences, n.e.c.</option>
//                 </optgroup>
        
//                 <optgroup label="Physical sciences">
//                     <option value="10">Astronomy and astrophysics</option>
                
//                     <option value="11">Chemistry</option>
                
//                     <option value="12">Materials science</option>
                
//                     <option value="13">Physics</option>
                
//                     <option value="14">Physical sciences, n.e.c.</option>
//                 </optgroup>
        
//                 <optgroup label="Psychology">
//                     <option value="31">Psychology</option>
//                 </optgroup>
        
//                 <optgroup label="Social sciences">
//                     <option value="15">Anthropology</option>
                
//                     <option value="16">Economics</option>
                
//                     <option value="17">Political science</option>
                
//                     <option value="18">Sociology</option>
                
//                     <option value="19">Social sciences, n.e.c</option>
//                 </optgroup>
//             </select>
//             <span className="select2 select2-container select2-container--bootstrap" dir="ltr" data-select2-id="5" style={{width: "100%"}}>
//                 <span className="selection">
//                     <span className="select2-selection select2-selection--multiple" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-disabled="false">
//                         <ul className="select2-selection__rendered">
//                             <li className="select2-search select2-search--inline">
//                                 <input className="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" placeholder="No priority, order by distance" style = {{width: "747.991px"}}/>
//                             </li>
//                         </ul>
//                     </span>
//                 </span>
//                 <span className="dropdown-wrapper" aria-hidden="true"></span>
//             </span>
//         </div>
        
        
//         <div className="form-group">
//             <div className="row" style={{display: "none"}}>
//                 <label className="col-xs-12">
//                     <input type="checkbox"/>Only include Institutions with contacts
//                 </label>
//             </div>
//             <div className="row">
//                 <label className="col-xs-3">
//                     <input type="checkbox"/>PUI
//                 </label>
//                 <label className="col-xs-3">
//                     <input type="checkbox"/>MSI
//                 </label>
//             </div>
//             <div className="row">
//                 <label className="col-xs-12">Doctoral Universities:</label>
//             </div>
//             <div className="row">
//                 <label className="col-xs-3"><input type="checkbox"/>R1</label>
//                 <label className="col-xs-4"><input type="checkbox"/>Non-R1</label>
//                 <label className="col-xs-5"><input type="checkbox"/>Not Doctoral</label>
//             </div>
//             <span className="has-error" style={{display: "none"}}>Please select at least one category</span>
//         </div>
        
        
//         <div className="form-group mt-25">
//             <div className="col-xs-6">
//                 <button type="button" className="form-group btn btn-primary">Search</button>
//             </div>
//             <div className="col-xs-6">
//                 <button type="button" className="form-group btn btn-secondary">Reset Search</button>
//             </div>
//         </div>
        
//         <div className="form-group"></div>
//     </fieldset>
// </form>


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
