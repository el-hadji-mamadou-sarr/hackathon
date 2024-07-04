import React, { useState } from "react";
import "./Writer.css";

const Writer = ({ writeFn }) => {
  const [first_name, setFirstName] = React.useState("");
  const [last_name, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [locker_number, setLockerNumber] = useState(null);
  const onSave = (user_uid) => {
    writeFn(user_uid);
  };

  const submitForm = (e) => {
    const URL = import.meta.env.VITE_SERVER_URL;
    fetch(URL + "/api/createToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        locker_number: locker_number,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        user_uid = data.user_uid;
        onSave(user_uid);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <>
      <form onSubmit={submitForm}>
        <div className="writer-container">
          <label className="label" htmlFor="">
            First Name
          </label>
          <input
            type="text"
            placeholder="Enter First Name..."
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
          ></input>
          <label className="label" htmlFor="">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Enter Last Name..."
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
          ></input>
          <label className="label" htmlFor="">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <label className="label" htmlFor="">
            Locker number
          </label>
          <input
            type="number"
            placeholder="Enter Locker number..."
            value={locker_number}
            onChange={(e) => setLockerNumber(e.target.value)}
          ></input>
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default Writer;
