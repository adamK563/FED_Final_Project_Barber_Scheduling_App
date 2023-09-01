import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { getAppointments } from "../utils/idb";
import "./CalendarApp.css";
import AppointmentSubmission from "./AppointmentSubmission";
import DurationSelector from "./DurationSelector";
import AppointmentsList from "./AppointmentsList";

function CalendarApp() {
  // State to manage selected date, duration, and appointments
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState("day");
  const [appointments, setAppointments] = useState([]);

  // Filter appointments based on duration and selected date
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
    // Return true by default if duration is not recognized
    return true;
  });

  // State to track the total price of filtered appointments
  const [, setTotalPrice] = useState(0);

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
    // Calculate total price based on filtered appointments using reduce
    const total = filteredAppointments.reduce((sum, appointment) => {
      return sum + appointment.price;
    }, 0);

    // Update the total price in state
    setTotalPrice(total);
  }, [filteredAppointments]);

  return (
    <div className="calendar-app">
      <h2>Barber Scheduling App</h2>
      {/* Component for submitting appointments */}
      <AppointmentSubmission
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        appointments={appointments}
        setAppointments={setAppointments}
      ></AppointmentSubmission>
      <div className="appointment-list">
        <h3>
          Appointments for {selectedDate.toDateString()} ({duration})
        </h3>
        {/* Component for selecting duration */}
        <DurationSelector setDuration={setDuration}></DurationSelector>
        {/* Component for displaying appointments */}
        <AppointmentsList
          appointments={appointments}
          duration={duration}
          selectedDate={selectedDate}
        ></AppointmentsList>
      </div>
    </div>
  );
}

export default CalendarApp;
