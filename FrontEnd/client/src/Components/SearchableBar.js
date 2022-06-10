import React, { useState, useRef, useEffect } from 'react';
import './SearchableBar.css';

const SearchbarDropdown = (props) => {
    const { options, onInputChange } = props;
    const ulRef = useRef();
    const inputRef = useRef();
    useEffect(() => {
        inputRef.current.addEventListener('click', (event) => {
            event.stopPropagation();
            ulRef.current.style.display = 'flex';
            onInputChange(event);
        });
        document.addEventListener('click', (event) => {
            ulRef.current.style.display = 'none';
        });
    }, []);    
    return (
        <div classname = 'search-bar-dropdown'>
            <input
                id = 'search-bar'
                type = 'text'
                className = 'form-control'
                placeholder = 'Search'
                ref = {inputRef}
                onChange = {onInputChange}
            />
            <ul id = 'results' className = 'list-group' ref = {ulRef}>
                {options.map((option,index) => {
                    return (
                        <button
                            type = 'button'
                            key = {index}
                            onClick = {(e) => {
                                inputRef.current.value = option;
                            }}
                            className = 'list-group-item list-group-item-action'
                        >
                        {option}
                        </button>
                    );
                })}
            </ul> 
        </div>
    );
};

const defaultOptions = [
    'Auger Electron Spectroscopy (AES)',
    'Atomic Force Microscopy (AFM)',
    'Contact Angle',
    'more...'
];


function SearchableBar() {
    const [options, setOptions] = useState([]);
    const onInputChange = (event) => {
        setOptions(
            defaultOptions.filter((option) => option.includes(event.target.value))
        );
    };
    return (
        <div className = 'SearchableBar container mt-2 mb-3'>
            <SearchbarDropdown options={options} onInputChange={onInputChange}/>
        </div>
    );
}

export default SearchableBar;