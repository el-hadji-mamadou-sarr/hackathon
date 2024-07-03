import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Writer from './components/Writer'

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
  const onWrite = async(url) => {
        try {
            const ndef = new window.NDEFReader();
            // This line will avoid showing the native NFC UI reader
            await ndef.scan();
            await ndef.write({records: [{ recordType: "url", data: url }]});
            alert(`Value Saved!`);
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <>
    <Writer writeFn={onWrite}/>
    </>
  )
}

export default App
