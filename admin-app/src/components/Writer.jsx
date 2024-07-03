import { useState } from "react";

const Writer = ({writeFn}) => {
    const [message, setMessage] = useState('');
    const [user_uid, setUserUid] = useState("")
    const onSave = (e) => {
        e.preventDefault();
        writeFn(user_uid);
        setMessage('');
    };

    return (
      <>

    <form onSubmit={onSave}>
      <input type="text" id="name" name='name' value={user_uid} onChange={(e)=>setUserUid(e.target.value)}/>
      <button type='button'>Create token</button>
    </form>
      </>
    );
};

export default Writer;