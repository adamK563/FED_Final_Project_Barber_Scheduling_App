import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addAppointment } from "../utils/idb";

function AppointmentSubmission(props) {
  // State to manage appointment form input
  const [appointmentDetails, setAppointmentDetails] = useState({
    time: "",
    haircutType: "",
    name: "",
    phoneNumber: ""
  });

  // Destructuring props for easier access
  const {
    selectedDate,
    setSelectedDate,
    appointments,
    setAppointments
  } = props;

  // Function to handle appointment submission
  const handleAppointmentSubmit = async () => {
    // Create a new appointment object
    const newAppointment = {
      date: selectedDate,
      time: appointmentDetails.time,
      haircutType: appointmentDetails.haircutType,
      name: appointmentDetails.name,
      phoneNumber: appointmentDetails.phoneNumber,
      price: calculatePrice(appointmentDetails.haircutType)
    };

    try {
      // Add the appointment to the database and get the ID
      const appointmentId = await addAppointment(newAppointment);
      newAppointment.id = appointmentId;

      // Update the appointments state with the new appointment
      setAppointments([...appointments, newAppointment]);

      // Clear the appointment form
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

  // Function to calculate appointment price based on haircut type
  const calculatePrice = (haircutType) => {
    if (haircutType === "male") {
      return 50;
    } else if (haircutType === "female") {
      return 70;
    }
    return 0;
  };

  // Function to handle input changes in the appointment form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  return (
    <div className="calendar-app">
      <div className="calendar-container">
        {/* Calendar component for selecting a date */}
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>
      <div className="appointment-form">
        <h3>Appointment Submission</h3>
        {/* Input fields for appointment details */}
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
        {/* Button to submit the appointment */}
        <button onClick={handleAppointmentSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default AppointmentSubmission;
