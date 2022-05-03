import React, { useEffect, useState } from "react";
import { listAllReservations, listResWithoutDate } from "../utils/api"

export default function Search() {

    const initialFormState = {
        mobile_number: "",
    };

    const [ formData, setFormData ] = useState({ ...initialFormState }); 
    const [ reservations, setReservations ] = useState([]);
    const [ reservationsErrors, setReservationsErrors ] = useState([]);
    const [ showRes, setShowRes ] = useState(true);
    const [ foundRes, setFoundRes ] = useState([]);

    useEffect(()=> {
        const ac = new AbortController();
        setReservationsErrors(null);
        listAllReservations(ac.signal)
        .then(setReservations)
        .catch(setReservationsErrors)
      }, []);

      if(reservationsErrors) console.log(reservationsErrors);

    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      };     

    const handleSubmit = async (event) => {
        event.preventDefault();
        const ac = new AbortController();

        // takes in phone number, validates input,
        setShowRes(false);

        // removes spaces, characters, letters
        const formattedNum = formData.mobile_number.replace(/[^A-Z0-9]/ig, "");

        if (formattedNum) {
          try {
            const reservationsFromSearch = await listResWithoutDate(formattedNum, ac.signal);
            if (reservationsFromSearch) {
              setFoundRes(reservationsFromSearch);
            } else {
              setFoundRes(null);
            }
          } catch (err) {
            throw err
          }     
        } else {
            setShowRes(true);
            window.alert('Number Is Invalid');
        };
        return ac.abort();
    };

return (
    <div>
        <form onSubmit={handleSubmit}>
        <label>
            Mobile Number:
            <input type="text" name="mobile_number" onChange={handleChange} placeholder={"Enter the customer's mobile number"} />
        </label>
            <button type="submit" className="btn btn-primary">Find</button>
        </form>
    <table>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>People</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {showRes ? 
          reservations.map((reservation) => (
            <tr key={reservation.reservation_id}>
            <td>{reservation.reservation_id}</td>
            <td>{`${reservation.first_name}, ${reservation.last_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td>{reservation.status}</td>   
            </tr>
          )) : 
          foundRes.length > 0 ?
          foundRes.map((reservation) => (
            <tr key={reservation.reservation_id}>
            <td>{reservation.reservation_id}</td>
            <td>{`${reservation.first_name}, ${reservation.last_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td>{reservation.status}</td>       
            </tr>
          )) :
          "No reservations found"}
        </tbody>
      </table>

    </div>
    )
}