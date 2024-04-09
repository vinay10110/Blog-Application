import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {formatISO9075} from "date-fns";
import {UserContext} from "../UserContext";
import {Link} from 'react-router-dom';
import { Navigate } from "react-router-dom";
import bin from '../assets/bin.png';
import loadingAnime from '../assets/Animation - 1712636343373.json';
import Lottie from 'lottie-react'
export default function PostPage() {
  const [postInfo,setPostInfo] = useState(null);
  const [redirect,setRedirect]=useState(false);
  const [loading,setLoading]=useState(false);
  const {userInfo} = useContext(UserContext);
  const {id} = useParams();
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/post/${id}`)
      .then(response => {
        response.json().then(postInfo => {
          setPostInfo(postInfo);
          setLoading(false)
        });
      });
  }, [id]);

  if (!postInfo) return '';
  async function deletePost() {
    const data={
      id
    }
    const token=userInfo.token;
    const response = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/post`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data),
      credentials: 'include',
    });
   
    if (response.ok) {
      setRedirect(true);
    }
   
  }
  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <div>
      {loading && <Lottie animationData={loadingAnime} className="lottie-logo"/>}
      {!loading && 
      <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      <div className="btn-container">
      {userInfo && userInfo.id === postInfo.author._id && ( 
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit this post
          </Link>
          
        </div>
      )}
      {userInfo && userInfo.id === postInfo.author._id && (
        
          <div className="delete-row">
            
          <a href='/' onClick={deletePost} className="edit-btn"><img src={bin} className="bin-icon" alt="bin-icon"></img>Delete this post</a>
        </div>
        
      )}
       </div>
      <div className="image">
        <img src={`${postInfo.fileData}`} alt="post"/>
      </div>
      <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
    </div>}
    </div>
  );
}
