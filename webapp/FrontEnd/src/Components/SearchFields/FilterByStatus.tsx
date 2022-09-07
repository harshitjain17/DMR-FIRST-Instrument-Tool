import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";
import { Form, Tooltip } from "react-bootstrap";

interface IFilterByStatusProps {
    xlargeScreen: boolean,
    includeRetired: boolean,
    onIncludeRetiredrChanged: (value: boolean) => void
}


export function FilterByStatus({ includeRetired, onIncludeRetiredrChanged, xlargeScreen }: IFilterByStatusProps) {

    const IRIChangeHandler = () => {
        onIncludeRetiredrChanged(!includeRetired);
    };

    return (
        <div className={xlargeScreen ? "mt-4" : "mt-2"}>
            <Form.Group className="mb-1" controlId="formIRI">
                <FormControlLabel
                    id="formIRI"
                    control={
                        <Checkbox
                            checked={includeRetired}
                            onChange={IRIChangeHandler}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    }
                    label="Include retired instruments"
                />
            </Form.Group>
        </div>
    );
}