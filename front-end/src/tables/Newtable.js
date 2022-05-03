import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api"
import TableErrors from "./TableErrors";
import { today } from "../utils/date-time";

export default function NewTable() {
    const initialFormState = {
        table_name: "",
        capacity: 0,
    };

    const [ errors, setErrors ] = useState(null);
    const history = useHistory();
    const [table,  setTable] = useState(initialFormState);
    const changeHandler = ({ target: { name, value } }) => {
        setTable((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const changeHandlerNum = ({ target: { name, value } }) => {
        setTable((prevState) => ({
            ...prevState,
            [name]: Number(value),
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setErrors(null);
        const ac = new AbortController();
        createTable(table, ac.signal)
            .then(() => {
                history.push(`/dashboard?date=${today()}`);
            })
            .catch(setErrors);
        return ac.abort();
    }

    return (
        <main>
            <h1>Create Table</h1>
            <TableErrors errors={errors} />
            <form onSubmit={handleSubmit}>
                <label>
                    Table Name:
                    <input type="text" name="table_name" value={table.table_name} minlength={2} required={true} onChange={changeHandler} placeholder={"Table Name"} />
                </label>
                <label>
                    Capacity:
                    <input type="number" name="capacity" value={table.capacity} min={1} required={true} onChange={changeHandlerNum} placeholder={"Capacity"} />
                </label>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" onClick={() => history.goBack()}>Cancel</button>
            </form>
        </main> 
    )
};