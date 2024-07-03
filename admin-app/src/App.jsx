import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [name, setName] = useState("")
    const createToken = (name)=>{
    const URL = "http://localhost:7000"
    fetch(URL + '/createToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name }),
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
  return (
    <>
    <form>
      <label htmlFor="">Insert name of the user</label>
      <input type="text" id="name" name='name' value={name} onChange={()=>setName(name)}/>
    </form>
    </>
  )
}

export default App
