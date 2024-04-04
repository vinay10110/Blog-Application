import React, { useState } from 'react'
import {Navigate} from 'react-router-dom'
const Register = () => {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [redirect,setRedirect]=useState(false);
  async function register(ev){
    ev.preventDefault();
    
   const response=await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/register`,{
      method:"POST",
      body:JSON.stringify({username,password}),
      headers:{
        'content-type':'application/json'
      },
    });
    if(response.status===200){
      alert('Registration Successful');
      setRedirect(true);
    }
    else{
      alert('Registration Failed')
    }
  
  }
if(redirect){
  return <Navigate to={'/login'} />
}
  return (
    <form className="register" onSubmit={register}>
        <h1>Register</h1>
<input type="text" 
placeholder='username'
value={username}
onChange={ev=>setUsername(ev.target.value)}
/>
<input type="password" 
placeholder='passwword'
value={password}
onChange={ev=>setPassword(ev.target.value)}
/>
<button>Register</button>
    </form>
  )
}

export default Register
