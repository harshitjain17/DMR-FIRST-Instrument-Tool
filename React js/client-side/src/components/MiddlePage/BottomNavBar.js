function BottomNavBar () {
    return (
        <div>
            <ul class="nav nav-tabs">
                <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#spec">Quick Specs</a></li>
                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#location">Location</a></li>
                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#contacts">Science Contacts</a></li>
                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#publications">Publications</a></li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane active container-fluid" id="spec">
                    <div class="row"><div class="col-12"><b>Multi-Module UHV MBE (MBE 1)</b></div></div>
                    <div class="row">
                        <div class="col-4">Cite as</div>
                        <div class="col-4"><a href="http://dmr-first.org/27.100/3250">http://dmr-first.org/27.100/3250</a></div>
                    </div>
                    <div class="row">
                        <div class="col-4">Instrument Category</div>
                        <div class="col-4">Synthesis</div>
                    </div>
                    <div class="row">
                        <div class="col-4">Instrument Type</div>
                        <div class="col-4">Thin Film, MBE</div>
                    </div>
                    <div class="row">
                        <div class="col-4">Manufacturer</div>
                        <div class="col-4">DCA</div>
                    </div>
                    <div class="row">
                        <div class="col-4">Acquisition Date</div>
                        <div class="col-4">4/1/2017</div>
                    </div>
                    <div class="row">
                        <div class="col-4">Status</div>
                        <div class="col-4"></div>
                    </div>
                </div>
            </div>
            <div class="tab-pane container-fluid" id="connectedEquipment"><table class="table table-striped"><tbody></tbody></table></div>
            <div class="tab-pane container-fluid" id="location">
                <div class="row">
                    <div class="col-4">35 Davey Laboratory<br/>Pollock Road<br/>University Park, PA 16801<br/>USA<br/></div>
                    <div class="col-8"><iframe width="600" height="250" frameborder="0" style="border:0" allowfullscreen="true" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBWAhdwQk6dpFAjF4QcTfUo_pZH0n0Xgxk&amp;q=Davey%20Laboratory,%20Pollock%20Road,%20University%20Park,%20PA%2016801,%20USA"></iframe></div>
                </div>
            </div>
            <div class="tab-pane container-fluid" id="contacts">
                <table class="table table-striped">
                <tbody>
                    <tr>
                        <td>Nitin Samarth</td>
                        <td></td>
                        <td>nxs16@psu.edu</td>
                    </tr>
                    <tr>
                        <td>Anthony Richardella</td>
                        <td></td>
                        <td>arr19@psu.edu</td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div class="tab-pane container-fluid" id="publications">
                <a href="">Changes of Magnetism in a Magnetic Insulator due to Proximity to a Topological Insulator</a><p>Physical Review Letters 125, 017204 (2020)</p>
                <hr/>
            </div>
        </div>
    )
};

export default BottomNavBar;