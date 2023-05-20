import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'
import { UserContext, MsgContext } from '../../App'
import PostComponent from './PostComponent'

export default function Profile() {
  const { state } = useContext(UserContext)
  const { setMsg } = useContext(MsgContext)
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  const [image, setImage] = useState("");
  useEffect(() => {
    if (state) {
      fetch('/users/profile').then(res => res.json()).then(result => {
        if (!result.error) {
          setUser(result.user)
          setPosts(result.posts)
        }
      })
    }
  }, [state])

  const updatePic = () => {
    if (image) {
      setMsg({ type: "UPDATE", payload: { error: 0, message: "In Process.........." } });
      const data = new FormData();
      data.append('image', image);
      axios.put('/users/updatePic', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (!res.data.error) {
          setUser({ ...user, pic: res.data.pic })
          setMsg({ type: "UPDATE", payload: { error: 0, message: res.data.message } });
          setInterval(() => {
            setMsg({ type: "CLEAR" })
          }, 10000)
        }
        else {
          setMsg({ type: "UPDATE", payload: { error: 1, message: res.data.error } });
          setInterval(() => {
            setMsg({ type: "CLEAR" })
          }, 10000)
        }
        setImage("")
      }).catch(err => {
        const errormessage = err.response.data.error || "Some error Occured";
        setMsg({ type: "UPDATE", payload: { error: 1, message: errormessage } });
        setInterval(() => {
          setMsg({ type: "CLEAR" })
        }, 10000)
      })
    }
  }
  return (
    <>
      {(user && state) ?
        <>
          <div className="shadow-lg bg-white card mt-3 container px-0" id="profile" style={{ border: "1px solid" }}>
            <div className="card-header text-center my-0" style={{ border: "1px solid", backgroundColor: "#c7d7d8" }}>
              <h2>{user.username}</h2>
            </div>
            <div className="card-body row">
              <h5 className="card-title col">
                <img src={user.pic ? user.pic.url : '...'} style={{ height: "100%", width: "60%" }} className="rounded float-left ml-3" alt="..."></img>
              </h5>
              <p className="card-text col">
                <h4 className='justify-content-center mt-2'>Email:<span>{state.email}</span></h4>
                <div className="row justify-content-center mr-4">
                  <div className="col">{user.followers.length} followers</div>
                  <div className="col">{user.followings.length} followings</div>
                  <div className="col">{posts.length} Posts</div>
                </div>
              </p>
            </div>
            <div className="input-group mb-3 mt-0">
              <div className="custom-file">
                <label className="custom-file-label justify-content-center" htmlFor="inputGroupFile01" >{image ? image.name : "Choose an img"}</label>
                <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" onChange={(e) => { setImage(e.target.files[0]) }} />
              </div>
              <button type="button" className="btn btn-info" onClick={updatePic}>UpdatePic</button>
            </div>
          </div>
          <hr />
          {
            posts.map((post) => {
              return (
                <PostComponent key={post._id} posttorender={post} />
              )
            })
          }
        </>
        : <></>
      }
    </>
  )
}
