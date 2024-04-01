import React, { useContext, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';
const Header = () => {
  const {setUserInfo,userInfo}=useContext(UserContext)

  useEffect(() => {
    fetch(`${process.env.HOST_ADDRESS}/profile`, {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  
  function logout(){
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/logout`,{
      method:'POST',
      credentials:'include',
    });
    <Navigate to={'/'}/>
    setUserInfo(null);
  }
  const username=userInfo?.username;
  return (
    <header>
      <Link to="/" className="logo">Myblog</Link>
      <nav>
        {username && (
          <>
          <Link to={'/create'}>Create  new post</Link>
          <a className="anchor" onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
          <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
</>
        )}
      
    </nav>
    </header>
  )
}

export default Header
