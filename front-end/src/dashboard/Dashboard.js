import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { listReservations, listTables, updateReservationStatus, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time"

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
  const location = useLocation();
  const history = useHistory();

  // load all reservations on initial page load, then whenever currentDay is updated
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables().then(setTables).catch(setTablesError);
    return () => abortController.abort();
  };

  if (reservationsError) console.log(reservationsError);

  if (tablesError) console.log(tablesError);

  const goBack = (event) => {
    history.push(`/dashboard?date=${previous(date)}`);
  };

  const goToday = (event) => {
    history.push(`/dashboard?date=${today()}`);
  };

  const goNext = (event) => {
    history.push(`/dashboard?date=${next(date)}`);
  };

  function cancel(reservation_id) {
    console.log("Cancelling")
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      updateReservationStatus(reservation_id)
      .then(loadDashboard)
      .catch(setReservationsError)
    }
  }

  function onFinish(table_id, reservation_id) {
    if (window.confirm("Is this table ready to seat new guests?")) {
    finishTable(table_id, reservation_id)
      .then(loadDashboard)
    }
  }

  // filters reservations to only return those with "booked" or "seated" status
  const filteredReservations = reservations.filter((reservation) => reservation.status === "booked" || reservation.status === "seated")

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">{`Reservations for ${date}`}</h4>
        <div className="btn-group" role="group" aria-label="navigation buttons">
          
        <button className="btn btn-secondary" onClick={(goBack)}>
        <span className="oi oi-chevron-left"></span>
        &nbsp;
        Previous
        </button>

        <button className="btn btn-secondary" onClick={goToday}>
        Today
        </button>

        <button className="btn btn-secondary" onClick={goNext}>
        Next 
        &nbsp;
        <span className="oi oi-chevron-right"></span>
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
          {filteredReservations.length > 0 ? filteredReservations.map((reservation, index) => (
            <tr key={reservation.reservation_id}>
            <td>{reservation.reservation_id}</td>
            <td>{`${reservation.first_name}, ${reservation.last_name}`}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
            <td>
            {reservation.status === "booked" && 
            <a href={`/reservations/${reservation.reservation_id}/seat`}><button className="btn btn-secondary">Seat</button></a>
            }
            </td>
            <td>
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
                <button className="btn btn-secondary">Edit</button>
            </a>
            </td>
            <td>
            <button className="btn btn-secondary" data-reservation-id-cancel={reservation.reservation_id} 
            onClick={() => cancel(reservation.reservation_id)}>
              Cancel
            </button>
            </td>         
            </tr>
          )) : <tr><td>No Reservations Found</td></tr>}
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
            <tr key={table.table_id}>
            <td>{table.table_id}</td>
            <td>{`${table.table_name}`}</td>
            <td>{table.capacity}</td>
            <td data-table-id-status={table.table_id}>{`${table.reservation_id ? "occupied" : "free"}`}</td>        
            <td>{ table.reservation_id && 
            <button data-table-id-finish={table.table_id}
              className="btn btn-secondary" 
              onClick={() => onFinish(table.table_id, table.reservation_id)}>
                Finish
            </button> }
            
            </td>
            </tr>
          ))}
        </tbody>
      </table>

    </main>
  );
}

export default Dashboard;
