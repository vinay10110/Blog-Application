import Post from "../Post";
import { useEffect, useState } from "react";
import Lottie from 'lottie-react';
import animation from '.././assets/Animation - 1712636343373.json'
export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    setLoading(true); 

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/post`, {
      method: "GET",
    })
      .then((response) => {
        response.json().then((posts) => {
          setPosts(posts);
          setLoading(false); 
        });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false); 
      });
  }, []); 

  return (
    <div>
      {loading && <Lottie animationData={animation} className="lottie-logo"/>}
      {!loading && posts.length > 0 && posts.map((post) => <Post key={post._id} {...post} />)}
    </div>
  );
}