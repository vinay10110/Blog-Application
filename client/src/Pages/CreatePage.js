import 'react-quill/dist/quill.snow.css';
import { useState,useContext } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import FileBase from 'react-file-base64';
import { UserContext } from '../UserContext';
export default function CreatePost() {
  const {userInfo}=useContext(UserContext)
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [fileData, setFileData] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
    const token=userInfo.token;
    const data = {
      title,
      summary,
      content,
      fileData
    };
    const response = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/post`, {
      method: 'POST',
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
    <form onSubmit={createNewPost}>
      <input type="title"
        placeholder={'Title'}
        required
        value={title}
        onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
        placeholder={'Summary'}
        required
        value={summary}
        onChange={ev => setSummary(ev.target.value)} />
      <FileBase type="file"
        multiple={false}
        onDone={({ base64 }) => setFileData( base64 )}
      />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: '5px' }}>Create post</button>
    </form>
  );
}