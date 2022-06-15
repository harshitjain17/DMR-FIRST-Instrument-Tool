import React from 'react';
import './SearchableBar.css';

export default class SearchableBar extends React.Component {
    constructor (props) {
        super(props);
        this.state  = {
            suggestions: [],
            enteredInstrumentType: ''
        }
    }

    onTextChanged = (event) => {
        const { items } = this.props;
        const value = event.target.value;
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = items.sort().filter(v => regex.test(v));
        }
        this.setState(() => ({ suggestions, enteredInstrumentType: value}));

    }

    suggestionSelected (value) {
        this.setState(() => ({
            enteredInstrumentType: value,
            suggestions: []
        }))
    }

    renderSuggestions () {
        const { suggestions } = this.state;
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map((item) => <li onClick = {() => this.suggestionSelected(item)}>{item}</li>)}
            </ul>
        );
    }

    render () {
        const { enteredInstrumentType } = this.state;
        return (
            <div>
                <input className="form-control" type="search" placeholder="Enter technique" value = {enteredInstrumentType} onChange={this.onTextChanged}/>
                {this.renderSuggestions()}
            </div>
        )
    }
}