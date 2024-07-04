import React, { useEffect, useState } from "react";
import { Connected } from "./components/Connected";
import { Failed } from "./components/Failed";

const App = () => {
  const [valid, setValid] = useState(null);

  const validateHash = (user_uid) => {
    const URL = import.meta.env.VITE_SERVER_URL;
    fetch(URL + "/api/validateHash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_uid: user_uid }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setValid(data.valid);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const user_uid = url.pathname.split("/").pop();
    validateHash(user_uid);
  }, []);

  return (
    <div>
      {valid === null && <div>Validating...</div>}
      {valid === true && <Connected />}
      {valid === false && <Failed />}
    </div>
  );
};

export default App;
