import React from 'react';
import './Writer.css';

const Writer = ({ writeFn }) => {
    const [user_uid, setUserUid] = React.useState('');
    const [first_name, setFirstName] = React.useState('');
    const [last_name, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const onSave = (user_uid) => {
        writeFn(user_uid);
        setMessage('');
    };

    const submitForm = (e)=>{
        
    const URL = "https://b8d6-37-174-67-44.ngrok-free.app/api"
    fetch(URL + '/createToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({first_name: first_name, last_name: last_name, email: email}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        user_uid = data.user_uid;
        onSave(user_uid)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    return (
        <>
            <form onSubmit={submitForm}>
                <div className="writer-container">
                    <label htmlFor="">First Name</label>
                    <input type="text" placeholder="Enter First Name..." value={first_name} onChange={(e) => setFirstName(e.target.value)}></input>
                    <label htmlFor="">Last Name</label>
                    <input type="text" placeholder="Enter Last Name..." value={last_name} onChange={(e) => setLastName(e.target.value)}></input>
                    <label htmlFor="">Email</label>
                    <input type="text" placeholder="Enter Email..." value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <button className="btn" type="submit">
                        Save
                    </button>
                </div>
            </form>
        </>
    );
};

export default Writer;