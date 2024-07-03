import { useState } from "react";
import reactLogo from "./assets/react.svg";
import lockerClose from "./assets/locker/locker-close.png";
import lockerOpen from "./assets/locker/locker-open.png";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  return (
    <div className="flex justify-center items-center">
      <img src={lockerClose} alt="locker close" />

      <img src={lockerClose} alt="locker close" />
      <img src={lockerClose} alt="locker close" />
      <img src={lockerOpen} alt="locker close" />
      <img src={lockerClose} alt="locker close" />
      <img src={lockerClose} alt="locker close" />
    </div>
  );
}

export default App;
