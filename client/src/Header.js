import React, { useContext, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';
const Header = () => {
  const {setUserInfo,userInfo}=useContext(UserContext)
<<<<<<< HEAD
console.log(setUserInfo);
console.log(userInfo);
=======

>>>>>>> 988154245771dbcce2475c99988cbafda2748cec
 
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/profile`, {
          method: 'GET',
          credentials: 'include',
        });
      
        if (response.ok) {
          const userInfoData = await response.json();
          setUserInfo(userInfo);
        } else {
          throw new Error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    
  

  
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

export default Header;
