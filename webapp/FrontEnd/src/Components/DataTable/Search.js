import React, { useState } from "react";

export default function Search ({ onSearch }) {
    const [search, setSearch] = useState("");

    const onInputChange = value => {
        setSearch(value);
        onSearch(value);
    };
    return (
        <input
            type="text"
            className="form-control"
            style={{ width: "240px" }}
            placeholder="Search"
            value={search}
            onChange={event => onInputChange(event.target.value)}
        />
    );
};