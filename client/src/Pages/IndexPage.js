import Post from "../Post";
import {useEffect, useState} from "react";
export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/post`,{
      method:"GET",
    
    }).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
    </div>
  );
}