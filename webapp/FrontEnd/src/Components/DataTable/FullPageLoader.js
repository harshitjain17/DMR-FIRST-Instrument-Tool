import React from "react";
import Spinner from "./Spinner.gif"

export default function FullPageLoader () {
    return (
        <div className="fp-container">
            <img src={Spinner} className="fp-loader" alt="loading" />
        </div>
    );
};