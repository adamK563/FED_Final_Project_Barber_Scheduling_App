import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addAppointment, getAppointments } from "../utils/idb"; // Make sure the path is correct
import "./CalendarApp.css";

function CalendarApp() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState("day");
  const [appointments, setAppointments] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState({
    time: "",
    haircutType: "",
    name: "",
    phoneNumber: ""
  });

  const handleAppointmentSubmit = async () => {
    const newAppointment = {
      date: selectedDate,
      time: appointmentDetails.time,
      haircutType: appointmentDetails.haircutType,
      name: appointmentDetails.name,
      phoneNumber: appointmentDetails.phoneNumber,
      price: calculatePrice(appointmentDetails.haircutType)
    };

    try {
      const appointmentId = await addAppointment(newAppointment);
      newAppointment.id = appointmentId;

      setAppointments([...appointments, newAppointment]);
      setAppointmentDetails({
        time: "",
        haircutType: "",
        name: "",
        phoneNumber: ""
      });
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  const calculatePrice = (haircutType) => {
    if (haircutType === "male") {
      return 50;
    } else if (haircutType === "female") {
      return 70;
    }
    return 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const selectedAppointments = appointments.filter(
    (appointment) =>
      appointment.date.toDateString() === selectedDate.toDateString()
  );

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    if (duration === "day") {
      return appointmentDate.toDateString() === selectedDate.toDateString();
    } else if (duration === "week") {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    } else if (duration === "month") {
      return (
        appointmentDate.getFullYear() === selectedDate.getFullYear() &&
        appointmentDate.getMonth() === selectedDate.getMonth()
      );
    } else if (duration === "year") {
      return appointmentDate.getFullYear() === selectedDate.getFullYear();
    }
    return true;
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Fetch appointments from IndexedDB and update the state
    async function fetchAppointments() {
      try {
        const appointmentsFromDB = await getAppointments();
        setAppointments(appointmentsFromDB);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    }

    fetchAppointments();
  }, []); // Run only on component mount

  useEffect(() => {
    // Calculate total price based on filtered appointments
    const total = filteredAppointments.reduce((sum, appointment) => {
      return sum + appointment.price;
    }, 0);
    setTotalPrice(total);
  }, [filteredAppointments]);

  return (
    <div className="calendar-app">
      <h2>Barber Scheduling App</h2>
      <div className="calendar-container">
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>
      <div className="appointment-form">
        <h3>Appointment Submission</h3>
        <input
          type="text"
          name="time"
          placeholder="Time"
          value={appointmentDetails.time}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <select
          name="haircutType"
          value={appointmentDetails.haircutType}
          onChange={handleInputChange}
        >
          <option value="">Select Haircut Type</option>
          <option value="male">Male Haircut</option>
          <option value="female">Female Haircut</option>
        </select>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={appointmentDetails.name}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={appointmentDetails.phoneNumber}
          onChange={handleInputChange}
        />
        <button onClick={handleAppointmentSubmit}>Submit</button>
      </div>
      <div className="appointment-list">
        <h3>
          Appointments for {selectedDate.toDateString()} ({duration})
        </h3>
        <div className="duration-selector">
          <button onClick={() => setDuration("day")}>Day</button>
          <button onClick={() => setDuration("week")}>Week</button>
          <button onClick={() => setDuration("month")}>Month</button>
          <button onClick={() => setDuration("year")}>Year</button>
        </div>
        <ul>
          {filteredAppointments.map((appointment, index) => (
            <li key={index}>
              <strong>
                {appointment.date.toDateString()} - {appointment.time}
              </strong>{" "}
              - {appointment.haircutType} Haircut
              <br />
              Name: {appointment.name}, Phone: {appointment.phoneNumber}
              <br />
              Price: ${appointment.price}
            </li>
          ))}
        </ul>
        <div className="total-sum">Total Price: ${totalPrice}</div>
      </div>
    </div>
  );
}

export default CalendarApp;
