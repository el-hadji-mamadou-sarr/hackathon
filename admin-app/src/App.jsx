import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [user_uid, setUserUid] = useState("")
  const [token, setToken]  = useState(null)
    const createToken = (user_uid)=>{
    const URL = "http://localhost:7000"
    fetch(URL + '/createToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_uid: user_uid }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        localStorage.setItem('token', data.token);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  const submitForm = ()=>{
    createToken(user_uid)
    console.log(token)
    writeToken().then(()=>console.log('token written'))
  }

  const writeToken = async()=>{
     const ndef = new NDEFReader();
    try {
      await ndef.write({
        records: [{ recordType: "url", data: "http://localhost:5173/"+user_uid }]
      });
      console.log("Write completed.");
    } catch {
      console.log("Write failed :-( try again.");
    };
  }
  return (
    <>
    <form>
      <label htmlFor="">Insert uid of user</label>
      <input type="text" id="name" name='name' value={user_uid} onChange={(e)=>setUserUid(e.target.value)}/>
      <button type='button' onClick={submitForm}>Create token</button>
    </form>
    </>
  )
}

export default App
