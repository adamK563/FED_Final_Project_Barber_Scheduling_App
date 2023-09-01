import React, { useState, useEffect } from "react";

function AppointmentsList(props) {
  // Destructure props for easier access
  const { appointments, duration, selectedDate } = props;

  // State to track the total price of filtered appointments
  const [totalPrice, setTotalPrice] = useState(0);

  // Filter appointments based on duration and selected date
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);

    // Check the duration to determine filtering logic
    if (duration === "day") {
      return appointmentDate.toDateString() === selectedDate.toDateString();
    } else if (duration === "week") {
      // Calculate the start and end of the selected week
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

  useEffect(() => {
    // Calculate total price based on filtered appointments using reduce
    const total = filteredAppointments.reduce((sum, appointment) => {
      return sum + appointment.price;
    }, 0);

    // Update the total price in state
    setTotalPrice(total);
  }, [filteredAppointments]); // Re-run this effect whenever filteredAppointments changes

  return (
    <>
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
    </>
  );
}

export default AppointmentsList;
