/*
  Adam Karpovich 314080383
  Veronika Kovaleva 321777583
*/
import React from "react";
import CalendarApp from "./components/CalendarApp"; // Make sure the path is correct

function App() {
  return (
    <div className="app">
      <header className="app-header"></header>
      <main className="app-main">
        <CalendarApp />
      </main>
      <footer className="app-footer">{/* Footer content */}</footer>
    </div>
  );
}

export default App;
