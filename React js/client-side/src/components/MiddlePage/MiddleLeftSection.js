import './MiddleLeftSection.css';
import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";


function MiddleLeftSection() {
return (
	<div className = 'middle-left-section'>
    <div id = "tool-tree">
	<Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>} className = "accordion-summary"><a>Materials Characterization Lab</a></AccordionSummary>
		
        <AccordionDetails>
		<ul className = "content">  
                <li>
                <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Auger Electron Spectroscopy (AES)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">PHI 670 with 680 motorized stage</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>
                
                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Atomic Force Microscopy (AFM)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Bruker Dimension Icon I</a></li>
                        <li><a href="#" className = "links">Bruker Dimension Icon II</a></li>
                        <li><a href="#" className = "links">Bruker Dimension Icon-IR</a></li>
                        <li><a href="#" className = "links">Bruker BioScope Resolve</a></li>
                        <li><a href="#" className = "links">Asylum Research Cypher VRS</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Contact Angle</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Automated Goniometer/ Tensiometer w/ Environmental Chamber Support</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Helium Pycnometry</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Micromeritics Accupyc II 1340</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Electron Backscattered Diffractometry (EBSD)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Oxford Symmetry</a></li>
                        <li><a href="#" className = "links">Oxford Nordlys Max2</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Energy Dispersive Spectroscopy (EDS)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Energy Dispersive Spectrometer</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Electrical Characterization Lab</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Trek 30kV Amplifier</a></li>
                        <li><a href="#" className = "links">Linear Variable Differential Tranformer (LVDT)</a></li>
                        <li><a href="#" className = "links">Modulab XM</a></li>
                        <li><a href="#" className = "links">Agilent E4980A</a></li>
                        <li><a href="#" className = "links">Agilent 4294A</a></li>
                        <li><a href="#" className = "links">FormFactor 11000B</a></li>
                        <li><a href="#" className = "links">Keysight P9374A PNA</a></li>
                        <li><a href="#" className = "links">Anritsu 37369D</a></li>
                        <li><a href="#" className = "links">Keysight PNA-X N5247B</a></li>
                        <li><a href="#" className = "links">pA meter</a></li>
                        <li><a href="#" className = "links">Linseis LSR - 3</a></li>
                        <li><a href="#" className = "links">Ecopia HMS-3000</a></li>
                        <li><a href="#" className = "links">Keithley 4200-SCS</a></li>
                        <li><a href="#" className = "links">Keysight B1500A</a></li>
                        <li><a href="#" className = "links">FormFactor 11000B</a></li>
                        <li><a href="#" className = "links">Cascade Probe Station</a></li>
                        <li><a href="#" className = "links">FormFactor 12000KB</a></li>
                        <li><a href="#" className = "links">Lake Shore CRX-VF</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>
        </ul>
		</AccordionDetails>
	</Accordion>
	
    
    
    
    
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}><a>2D Crystal Consortium</a></AccordionSummary>
		
        <AccordionDetails>
		<ul className = "content">  
                <li>
                <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Commons</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content"> 
                        <li><a href="#" className = "links">MCL Commons Imaging Workstation</a></li>
                        <li><a href="#" className = "links">ECL: Cascade 1200 (room temp)</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>
                
                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Electrical Characterization</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">ECL: 4294A Precision Impedance Analyzer</a></li>
                        <li><a href="#" className = "links">ECL: Cascade 1200 (room temp)</a></li>
                        <li><a href="#" className = "links">ECL: Ecopia HMS-3000 Hall Measurement</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>
        </ul>
		</AccordionDetails>
	</Accordion>
	
    
    
    
    
    
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}><a>Nanofabraction Lab</a></AccordionSummary>
		
        <AccordionDetails>
		<ul className = "content">  
                <li>
                <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Commons</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content"> 
                        <li><a href="#" className = "links">MCL Commons Imaging Workstation</a></li>
                        <li><a href="#" className = "links">ECL: Cascade 1200 (room temp)</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>
                
                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Electrical Characterization</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">ECL: 4294A Precision Impedance Analyzer</a></li>
                        <li><a href="#" className = "links">ECL: Cascade 1200 (room temp)</a></li>
                        <li><a href="#" className = "links">ECL: Ecopia HMS-3000 Hall Measurement</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>
        </ul>
		</AccordionDetails>
	</Accordion>
	
    
	</div>
    </div>
);
}

export default MiddleLeftSection;