import { React, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext, MsgContext } from '../../App';

export default function Login() {
  const { setMsg } = useContext(MsgContext);
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const post = (e) => {
    e.preventDefault()
    fetch('/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json()).then(data => {
      if (data.error) {
        // console.log(data.error)
        setMsg({ type: "UPDATE", payload: { error: 1, message: "Invalid Username or Password" } });
        setInterval(() => {
          setMsg({ type: "CLEAR" })
        }, 10000)
      }
      else {
        dispatch({ type: "USER", payload: data.user });
        setMsg({ type: "UPDATE", payload: { error: 0, message: data.message } });
        setInterval(() => {
          setMsg({ type: "CLEAR" })
        }, 10000)
        navigate('/profile')
      }
      setUsername("");
      setPassword("");
    }).catch(err => {
      const errormessage = err.response.data.error || "Some error Occured";
      setMsg({ type: "UPDATE", payload: { error: 1, message: errormessage } });
      setInterval(() => {
        setMsg({ type: "CLEAR" })
      }, 10000)
    })
  }

  return (
    <>
      <div className="row">
        <div className="offset-3 appForm">
          <h1 className="text-center mx-auto">Login Form</h1>
          <form onSubmit={post} noValidate className="validated-form">
            <div className="mb-1">
              <label className="form-label" htmlFor="username">Username</label>
              <input className="form-control" type="text" id="username" value={username} onChange={(e) => { setUsername(e.target.value) }} required></input>
              <div className="valid-feedback">Looks good</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input className="form-control" type="password" id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} required></input>
              <div className="valid-feedback">Looks good</div>
            </div>
            <div className="mb-1 text-center">
              <button className="btn btn-success">Login</button>
            </div>
            <div className="mb-1 text-center">
              <Link to="/register">Don't have an account</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
