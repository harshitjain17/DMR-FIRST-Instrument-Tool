import "./Navbar.css";

function Navbar() {
    return (
        <div className="Header">
            <div id="top-left">
                <a href="https://www.psu.edu" title="Home" rel="Home" id="Logo"> <img src="https://www.mri.psu.edu/sites/default/files/psu-new-identity_mri.png" alt="Home"></img></a>
            </div>
            
            
            <div id="top-middle">
                <h1 id="site-name"><a href="https://www.psu.edu"><span>Materials Research Institute</span></a></h1>
                <div id="site-slogan"> Our integrated research laboratories turn concepts into prototypes </div>
            </div>
            
            
            <div id="top-right">
                <p class="rteright">
                    <a href="http://www.mri.psu.edu/intranet">Intranet at MRI</a><br/>
                    <a href="https://www.mri.psu.edu/covid-19-info"><img alt="" src="https://www.mri.psu.edu/sites/default/files/covid-19-MRIinfo.png"/> </a>
                </p>
            </div>
        </div>
    );
};

export default Navbar;