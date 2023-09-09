/*
  Adam Karpovich 314080383
  Veronika Kovaleva 321777583
*/
import React from "react";

function DurationSelector(props) {
  // Destructure the setDuration function from props
  const { setDuration } = props;

  return (
    <div className="duration-selector">
      {/* Buttons to set the duration when clicked */}
      <button onClick={() => setDuration("day")}>Day</button>
      <button onClick={() => setDuration("week")}>Week</button>
      <button onClick={() => setDuration("month")}>Month</button>
      <button onClick={() => setDuration("year")}>Year</button>
    </div>
  );
}

export default DurationSelector;
