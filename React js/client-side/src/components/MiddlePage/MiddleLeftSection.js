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

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Electron Probe MicroAnalysis (EPMA)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Cameca SX Five Capabilities</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Focused Ion Beam (FIB)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Helios 660</a></li>
                        <li><a href="#" className = "links">Scios 2</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Infrared Spectroscopy (FTIR)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Bruker V70</a></li>
                        <li><a href="#" className = "links">Bruker V80 Microscope</a></li>
                        <li><a href="#" className = "links">Bruker V80v</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Mechanical</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">50 kN MTS Criterion load frame</a></li>
                        <li><a href="#" className = "links">100 kN MTS Criterion load frame</a></li>
                        <li><a href="#" className = "links">3D DIC Camera</a></li>
                        <li><a href="#" className = "links">TA Instruments Q800 DMA</a></li>
                        <li><a href="#" className = "links">Qness Q60 A+ microindenter</a></li>
                        <li><a href="#" className = "links">Netzsch 402 F1/F3 Hyperion TMA</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Mercury Porosimetry</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Micromeritics AutoPore V Model 9620</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Nanoindentation</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Bruker Hysitron TI-980</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Optical Microscopy</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Zeiss AxioImager</a></li>
                        <li><a href="#" className = "links">Zeiss SmartZoom</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Optical Profilometry</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Zygo Nexview 3D Optical Surface Profiler</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Particle Size Analysis</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Zetasizer Nano ZS</a></li>
                        <li><a href="#" className = "links">Mastersizer 3000</a></li>
                        <li><a href="#" className = "links">Morphologi G3 SE</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Raman Spectroscopy</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Scientific LabRAM HR "VlabiNIR"</a></li>
                        <li><a href="#" className = "links">Scientific LabRAM HR "Lucy"</a></li>
                        <li><a href="#" className = "links">Scientific Xplora Plus</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Surface Analysis</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">PHI5000 VERSA PROBE II</a></li>
                        <li><a href="#" className = "links">PHI5000 VERSA PROBE III</a></li>
                        <li><a href="#" className = "links">UPS</a></li>
                        <li><a href="#" className = "links">REELS</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Scanning Electron Microscopy (SEM)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Verios G4</a></li>
                        <li><a href="#" className = "links">Apreo S</a></li>
                        <li><a href="#" className = "links">ESEM Q250</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Surface Area</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">ASAP 2020 / ASAP2420</a></li>
                        <li><a href="#" className = "links">Autopore V</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Transmission Electron Microscopy (TEM)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Tecnai G2</a></li>
                        <li><a href="#" className = "links">Talos F200C</a></li>
                        <li><a href="#" className = "links">Talos F200X</a></li>
                        <li><a href="#" className = "links">Titan³ G2</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Thermal Analysis</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Discovery TGA-MS</a></li>
                        <li><a href="#" className = "links">TA Q2000 DSC</a></li>
                        <li><a href="#" className = "links">STA 449 F3</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Time of Flight Secondary Ion Mass Spectrometry</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">PHI nanoTOF II</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>UV-Vis-NIR</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Perkin-Elmer Lambda 950 UV-Vis-NIR Spectrophotometer</a></li>
                        <li><a href="#" className = "links">Agilent/Cary 7000 with UMA</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>
                
                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>X-Ray Photoelectron Spectroscopy (XPS)</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Versa Probe II</a></li>
                        <li><a href="#" className = "links">Versa Probe III</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>XRD / SAXS-WAXS</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Malvern Panalytical Empyrean I / II / III</a></li>
                        <li><a href="#" className = "links">Malvern Panalytical XPert Pro MPD</a></li>
                        <li><a href="#" className = "links">Malvern Panalytical X'Pert3 MRD</a></li>
                        <li><a href="#" className = "links">XENOCS Xeuss 2.0 SAXS/WAXS</a></li>
                        <li><a href="#" className = "links">Multiwire Laue</a></li>
                        <li><a href="#" className = "links">Emp1; Emp2</a></li>
                        <li><a href="#" className = "links">MRD</a></li>
                        <li><a href="#" className = "links">Xuess SAXS/WAXS</a></li>
                        <li><a href="#" className = "links">McCrone Micronizing Mill</a></li>
                        <li><a href="#" className = "links">Retsch CryoMill</a></li>
                    </ul>
                    </AccordionDetails>
                </Accordion>
                </li>

                <li>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Zeta Potential</AccordionSummary>
                    <AccordionDetails>
                    <ul className = "content">
                        <li><a href="#" className = "links">Malvern Zetasizer ZS</a></li>
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