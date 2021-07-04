import React from "react";
import JSONTree from "react-json-tree";
import { withRouter} from "react-router-dom";
import candau from '../images/candau.png';


const Back = (props) => {
    return (
        <div className="container-fluid mt-5 col-4">
            <p>&nbsp;</p>
            <div className="justify-content-center">
                <div className="card">
                    <div className="card-header d-flex w-100 justify-content-between ">
                        <h6 className="pt-2">Contractes immobiliàris SMART CONTRACTS BARCELONA</h6>

                    </div>
                    <div className="card-body text-center">
                        <img style={{ width: '40%' }} src={candau} alt="No registrat" />
                        
                    </div>
                    <div className="card-footer bg-light text-center">
                        <h3>No estàs autoritzat</h3>
                        <h5>Sembla que no tens permís per usar aquest portal.</h5>
                        <h6 className="text-danger">Autentifica't amb un altre compte.</h6></div>
                </div>
            </div>
            <p>&nbsp;</p>
        </div>

    );
}

export default withRouter(Back);