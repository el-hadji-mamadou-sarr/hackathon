
import React, { useEffect, useState } from 'react';
import { Connected } from './components/Connected';
import { Failed } from './components/Failed';


const App = () => {
  const [valid, setValid] = useState(null)

  const validateHash = (hash)=>{
    const URL = "http://localhost:7000"
    fetch(URL + '/validateHash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash: hash }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setValid(data.valid);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const hash = url.pathname.split('/').pop();
    validateHash(hash);
  }, []);

  return (
    <div>
      {valid === null && <div>Validating...</div>}
      {valid === true && <Connected />}
      {valid === false && <Failed/>}
    </div>
  );
}

export default App;