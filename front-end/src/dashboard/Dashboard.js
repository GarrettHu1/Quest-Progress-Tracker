import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables, deleteRes } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time"
import Seat from "../tables/Seat"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [ reservations, setReservations ] = useState([]);
  const [ reservationsError, setReservationsError ] = useState(null);
  const [ tables, setTables ] = useState([]);
  const [ tablesError, setTablesError ] = useState(null);
  const [ currentDay, setCurrentDay ] = useState(today());

  const history = useHistory();

  console.log("today", currentDay)

  // load all reservations on initial page load, then whenever currentDay is updated
  useEffect(loadDashboard, [currentDay]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(currentDay, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  useEffect(()=> {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(currentDay, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError)
  }, [currentDay])

  if (reservationsError) console.log(reservationsError);

    // load all reservations on initial page load, then whenever currentDay is updated
    useEffect(loadDash, []);

    function loadDash() {
      const abortController = new AbortController();
      setTablesError(null);
      listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);
      return () => abortController.abort();
    };
  if (tablesError) console.log(tablesError);

  const goBack = (event) => {
    // event.preventDefault();
    // get current date, subtract 24hrs to get day before
    // load reservations from that day
    setCurrentDay(previous(currentDay));
    history.push(`/dashboard?date=${currentDay}`);
  };

  const goToday = (event) => {
    // event.preventDefault();
    setCurrentDay(today())
    history.push(`/dashboard?date=${currentDay}`);
  };

  const goNext = (event) => {
    // event.preventDefault();
    // get current date, add 24hrs to get day after
    // load dashboard containing reservations from query for that day
    setCurrentDay(next(currentDay));
    history.push(`/dashboard?date=${currentDay}`);
  };

  async function handleFinish(id) {
    // make a del req to tables, remove reservation_id
    if (window.confirm("Is this table ready to seat new guests?")) {
    const ac = new AbortController();
    await deleteRes(id, ac.signal);
    history.push("/")
    };
  };


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">{`Reservations for ${currentDay}`}</h4>
        <div className="btn-group" role="group" aria-label="navigation buttons">
        <button className="btn btn-secondary" onClick={(goBack)}>
        <span className="oi oi-chevron-left"></span>
        &nbsp;Previous
        </button>
        <button className="btn btn-secondary" onClick={goToday}>
        Today
        </button>
        <button className="btn btn-secondary" onClick={goNext}>
        Next&nbsp;<
        span class="oi oi-chevron-right"></span>
        </button>
        </div>
      </div>

      <ErrorAlert error={reservationsError} />
      
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
          {reservations.map((reservation, index) => (
            <tr key={index}>
            <td>{index}</td>
            <td>{`${reservation.first_name}, ${reservation.last_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td>{reservation.status}</td>
            <td>
            <button className="btn btn-secondary" 
            onClick={()=> {
              history.push(`/reservations/${reservation.reservation_id}/seat`);
              }}>
            Seat
            </button>
            <button className="btn btn-secondary" >
            Edit
            </button>
            <button className="btn btn-secondary" >
            Cancel
            </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Free?</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table, index) => (
            <tr key={index}>
            <td>{index}</td>
            <td>{`${table.table_name}`}</td>
            <td>{table.capacity}</td>
            <td>{`${table.reservation_id ? "Occupied" : "Free"}`}</td>        
            <td>{ table.reservation_id && 
            <button className="btn btn-secondary" onClick={() => handleFinish(table.table_id) }>Finish</button> }
            </td>
            </tr>
          ))}
        </tbody>
      </table>

    </main>
  );
}

export default Dashboard;
