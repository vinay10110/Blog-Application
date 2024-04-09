import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
const Header = () => {
  const {setUserInfo,userInfo}=useContext(UserContext)
  useEffect(() => {
    if(userInfo){
      const token=userInfo.token;
      if(token){
        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        }).then(response => {
          response.json().then(userInfo => {
            setUserInfo(userInfo);
          });
        });
      }
    }
    
  },[setUserInfo,userInfo]);
  

  function logout(){
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/logout`,{
      method:'POST',
      credentials:'include',
    });
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
          <a href='/' className="anchor" onClick={logout}>Logout ({username})</a>
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
