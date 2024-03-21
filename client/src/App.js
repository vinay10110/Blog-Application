import './App.css';
import Layout from './Layout';
import IndexPage from './Pages/IndexPage';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import Register from './Pages/Register';
import { UserContextProvider } from './UserContext';
import CreatePage from './Pages/CreatePage';
import PostPage from './Pages/PostPage';
import EditPost from './Pages/EditPost';
function App() {
  return (
<UserContextProvider>
<Routes>
      <Route path='/' element={<Layout />} >
      <Route index element={<IndexPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<Register />} />
      <Route path='/create' element={<CreatePage/>}/>
      <Route path='/post/:id' element={<PostPage />}/>
      <Route path='/edit/:id' element={<EditPost />}/>
      </Route>
    </Routes>
</UserContextProvider>
    



  );
}

export default App;
