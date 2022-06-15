import React, { useState } from 'react';
import './SearchableBar.css';

export default function SearchableBar(props) {
    const [enteredInstrumentType, setEnteredInstrumentType] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    

    const onTextChanged = (event) => {
        const value = event.target.value;
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = props.items.sort().filter(value => regex.test(value));
        }
        setSuggestions(suggestions);
        setEnteredInstrumentType(value);
    }

    const suggestionSelected = (value) => {
        setSuggestions([]);
        setEnteredInstrumentType(value);
        props.onSaveInput(value);
    };

    const renderSuggestions = () => {
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map((item) => <li onClick = {() => suggestionSelected(item)}>{item}</li>)}
            </ul>
        );
    };
    
    return (
        <div>
            <input className="form-control" type="search" placeholder="Enter technique" value = {enteredInstrumentType} onChange={onTextChanged}/>
            {renderSuggestions()}
        </div>
    )
};
