import {useEffect, useState,useContext} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";
import FileBase from 'react-file-base64'
import { UserContext } from '../UserContext';
export default function EditPost() {
  const {userInfo}=useContext(UserContext);
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [fileData, setFileData] = useState('');
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/post/`+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
          setFileData(postInfo.fileData);
        });
      });
  }, [id]);
  async function updatePost(ev) {
    const token =userInfo.token;
    ev.preventDefault();
    const data = {
      id,
      title,
      summary,
      content,
      fileData
    };
    const response = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/post`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data),
      credentials: 'include'
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <FileBase type="file"
                 multiple={false}
                 onDone={({ base64 }) => setFileData( base64 )} />
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Update post</button>
    </form>
  );
}
