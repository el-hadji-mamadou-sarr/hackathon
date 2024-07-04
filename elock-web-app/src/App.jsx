import { useState } from "react";
import lockerClose from "./assets/locker/locker-close.png";
import lockerOpen from "./assets/locker/locker-open.png";
import "./App.css";
import { Dropdown } from "./components/Dropdown";

function App() {
  const [lockers, setLockers] = useState([0, 0, 0, 0, 0, 0]);
  const [selected, setSelected] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [authenticated, setAuthenticated] = useState({
    locker_number: null,
    authenticated: false,
  });

  const scan = (locker_number) => {
    setScanning(true);
    console.log("scanning locker number", locker_number);
    const URL = import.meta.env.VITE_SERVER_URL;
    fetch(URL + "/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locker_number }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "authenticated") {
          setAuthenticated({
            locker_number: locker_number,
            authenticated: true,
          });
          setScanning(false);
          openLocker(locker_number); // Open the locker upon successful authentication
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const openLocker = (locker_number) => {
    if (lockers[locker_number - 1] === 1) {
      console.log("locker already open");
    } else {
      const newLockers = [...lockers];
      newLockers[locker_number - 1] = 1;
      setLockers(newLockers);
    }
    console.log(lockers);
  };

  const closeLocker = (locker_number) => {
    if (lockers[locker_number - 1] === 0) {
      console.log("locker already closed");
    } else {
      const newLockers = [...lockers];
      newLockers[locker_number - 1] = 0;
      setLockers(newLockers);
    }
    console.log(lockers);
  };
  const lockLocker = (locker_number) => {
    if (authenticated.locker_number != locker_number) {
      console.log("locker already locked");
    } else {
      const URL = import.meta.env.VITE_SERVER_URL;
      fetch(URL + "/lockLocker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locker_number }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "ok") {
            closeLocker(locker_number); // Open the locker upon successful authentication
            setAuthenticated({
              locker_number: null,
              authenticated: false,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  return (
    <div className="flex justify-center items-center ">
      {lockers.map((locker, index) => (
        <div key={index} className="relative hover:cursor-pointer dropdown">
          <img
            src={locker === 0 ? lockerClose : lockerOpen}
            alt={`locker ${index + 1}`}
          />
          <span className="absolute top-20 font-semibold">{index + 1}</span>
          <Dropdown
            scan={scan}
            locker_number={index + 1}
            authenticated={authenticated}
            openLocker={openLocker}
            closeLocker={closeLocker}
            lockLocker={lockLocker}
          />
        </div>
      ))}
      {scanning && (
        <div className="modal">
          <div className="modal-content">
            <p>Scanning...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
