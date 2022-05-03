import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { editReservation, readReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import ResForm from "./ResForm";

export default function EditRes() {

const [ errors, setErrors ] = useState([]);
const history = useHistory();
const resId  = useParams().reservation_id;
const [ reservation, setReservation ] = useState([]);
const [ reservationsError, setReservationsError ] = useState(null);

const [ formData, setFormData ] = useState(null);

  // load all reservations on initial page load, then finds single reservation to edit
  useEffect(loadDashboard, []);

  function loadDashboard() {
    const ac = new AbortController();
    setReservationsError(null);
    readReservation(resId, ac.signal)
    .then((reservation) => {
      const newRes = {...reservation, reservation_date: formatAsDate(reservation.reservation_date)}
        setReservation(newRes);
        setFormData(newRes)
    })
      .catch(setReservationsError);

      
    return () => ac.abort();
  };

  if (reservationsError) console.log(reservationsError);

const handleChange = ({ target }) => {
    if (target.type === "date") {
        setFormData({
            ...formData,
            [target.name]: target.value.replace(/[^A-Z0-9]/ig, "").slice(0, 8),
          });
    } else if (target.type === "number") {
    setFormData({
      ...formData,
      [target.name]: Number(target.value),
    });} else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });}

  };  

const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();
    setErrors([]);
    const handleSubErrors = [];

    let a = formData.first_name;
    let b = formData.last_name;
    let c = formData.mobile_number;
    let d = formData.reservation_date.replace(/[^A-Z0-9]/ig, "");
    let e = formData.reservation_time;
    let f = formData.people;

    if ( a === "" || b === "" || c === "" || d === "" || f < 1 || e === ""){
        console.log(formData)
        window.alert('Please fill in all values')
    } else {
        console.log("Form data passes validations````````", formData)

    // res date values
    const resDate = new Date(d);
    console.log(d);
    const resMonth = Number(d.slice(5, 7));
    const resDay = Number(d.slice(8, 10));
    const resYear = Number(d.slice(0, 4));

    // check what day Mon - Sun, 0 - 6
    const dateValue = resDate.getDay();

    // current date values
    const today = new Date();
    const year = today.getFullYear();
    const mes = today.getMonth()+1;
    const dia = today.getDate();

    // current hours/mins
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();

    // res hours & mins
    const resMin = Number(e.slice(3, 5));
    const resHour = Number(e.slice(0, 2));

    // error types
    const dateTimeError = "Reservation date/time must occur in the future";
    const tuesError = "Reservation Date is on a Tuesday";
    const openingHoursError = "Reservation time must be during opening hours";
    
    if (dateValue === 1) {
        if (!errors.includes(tuesError)) {
            handleSubErrors.push(tuesError)
            console.log(errors)
        }
        console.log(errors);
    }
    
    if (
        resYear < year 
        || (resMonth === mes && resDay < dia) 
        || resMonth < mes 
        || (resDay === dia && resMonth === mes && resYear === year && hours > resHour )
        ) {
        handleSubErrors.push(dateTimeError);
        console.log(errors);
        }

        if (
            (resHour === hours && resMin < mins)
            || (resHour < 10)
            || (resHour === 10 && resHour < 30)
            || (resHour > 21)
            || (resHour === 21 && resMin > 30)
        ) {
            handleSubErrors.push(openingHoursError);
        }

        setErrors(handleSubErrors)
        if (handleSubErrors.length === 0){
        
        await editReservation(formData, ac.signal);
        history.push(`/dashboard?date=${formData.reservation_date}`);
    }
    }
    return ac.abort();
};

  const handleCancel = (event) => {
    event.preventDefault();
    history.go(-1);
  };

    return (
      <div>
        <h1>Edit Reservation</h1>
        <ResForm handleCancel={handleCancel} handleSubmit={handleSubmit} handleChange={handleChange} reservation={reservation} errors={errors} /> 
      </div>
    )
};
