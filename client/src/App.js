import React, { useEffect, createContext, useReducer, useContext } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import axios from 'axios'

import './App.css'
import Nav from './Components/screens/Nav'
import Home from './Components/screens/Home'
import Profile from './Components/screens/Profile'
import Login from './Components/screens/LogIn'
import Register from './Components/screens/Register'
import UserProfile from './Components/screens/UserProfile'
import SubPosts from './Components/screens/SubPosts'
import CreatePost from './Components/screens/CreatePost'
import Post from './Components/screens/Post'
import EditPost from './Components/screens/EditPost'
import Alert from './Components/screens/Alert'
import { userReducer, initialState } from './Components/reducers/userReducer'
import { msgReducer, initialMsg } from './Components/reducers/msgReducer'


export const UserContext = createContext();
export const MsgContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext)

  useEffect(() => {
    axios.get('/getloggedInUser').then(res => {
      if (res.data.user) {
        dispatch({ type: "USER", payload: res.data.user });
      }
      else {
        navigate('/login')
      }
    })
  }, [])

  return (
    <>
      <Routes>
        <Route exact path="/" element={
          <Home />
        }></Route>
        <Route path="/profile" element={
          <Profile />
        }></Route>
        <Route exact path="/login" element={
          <Login />
        }></Route>
        <Route exact path="/register" element={
          <Register />
        }></Route>
        <Route exact path="/createpost" element={
          <CreatePost />
        }></Route>
        <Route exact path="/posts/:postId/v" element={
          <Post />
        }></Route>
        <Route exact path="/users/:userId/v" element={
          <UserProfile />
        }></Route>
        <Route exact path="/subposts" element={
          <SubPosts />
        }></Route>
        <Route exact path="posts/:postId/edit" element={
          <EditPost />
        }></Route>
      </Routes>
    </>
  )
}

function App() {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [msg, setMsg] = useReducer(msgReducer, initialMsg);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <MsgContext.Provider value={{ msg, setMsg }}>
          <BrowserRouter>
            <Nav />
            <Alert />
            <Routing />
          </BrowserRouter>
        </MsgContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
