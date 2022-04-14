import React, { useState } from "react";
import { useHistory } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// route: /reservations/new

// Form containing follow fields:
// First name: `<input name="first_name" />`
// Last name: `<input name="last_name" />`
// Mobile number: `<input name="mobile_number" />`
// Date of reservation: `<input name="reservation_date" />`
// Time of reservation: `<input name="reservation_time" />`
// Number of people in the party, which must be at least 1 person. 
// `<input name="people" />`



export default function NewRes() {

const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",

};

const [ formData, setFormData ] = useState({ ...initialFormState });

const history = useHistory();

const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
  

const handleSubmit = async (event) => {
    event.preventDefault();
    let a = formData.name;
    let b = formData.last_name;
    let c = formData.mobile_number;
    let d = formData.reservation_date;
    let e = formData.reservation_time;
    let f = formData.people;


    // if one of inputs are empty show alert
    // if (e < 1030){window.alert('Please choose a time during opening hours')}
    if ( a === "" || b === "" || c === "" || d === "" || f < 1 || e === ""){window.alert('Invalid Input')}
    else if (d === "tuesday") {window.alert("Please choose a time during opening days")}
    else {
        // const requestOptions = {
        //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //     mode: 'cors', // no-cors, *cors, same-origin
        //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //     credentials: 'same-origin', // include, *same-origin, omit
        // };
        // fetch(`${API_BASE_URL}/reservations`, requestOptions)
        //     .then(response => response.json())
        //     .then(data => this.setState({ postId: data.id }));

        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(formData) // body data type must match "Content-Type" header
          });
          console.log(response);

    //   await createReservation(formData);
        history.push(`/reservations`);
    }
    
    // reset form state
    setFormData(initialFormState);
    history.go("/");
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  


    return (
        <main>
            <p>Hello</p>
            <form>
        <label>
            First Name:
            <input type="text" name="first_name" onChange={handleChange} />
        </label>
        <label>
            Last Name:
            <input type="text" name="last_name" onChange={handleChange} />
        </label>
        <label>
            Mobile Number:
            <input type="text" name="mobile_number" onChange={handleChange} />
        </label>
        <label>
            Date of reservation:
            <input type="date" name="reservation_date" onChange={handleChange} />
        </label>
        <label>
            Time of reservation:
            <input type="time" name="reservation_time" onChange={handleChange} />
        </label>
        <label>
            Number of people in the party:
            <input type="text" name="people" onChange={handleChange} />
        </label>
        <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
        <button onClick={handleCancel} className="btn btn-danger">Cancel</button>
        </form>
        </main> 
    )
};
