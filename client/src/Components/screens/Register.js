import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext, MsgContext } from '../../App';
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate()
    const { dispatch } = useContext(UserContext)
    const { setMsg } = useContext(MsgContext)
    const [username, setuserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");

    const post = (e) => {
        e.preventDefault()
        setMsg({ type: "UPDATE", payload: { error: 0, message: "In Process........" } });
        const data = new FormData()
        data.append('username', username)
        data.append('email', email)
        data.append('password', password)
        data.append('image', image)
        axios.post('/register', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            if (!res.data.error) {
                dispatch({ type: "USER", payload: res.data.user });
                setMsg({ type: "UPDATE", payload: { error: 0, message: res.data.message } });
                setInterval(() => {
                    setMsg({ type: "CLEAR" })
                }, 10000)
                navigate('/profile')
            }
            else {
                setMsg({ type: "UPDATE", payload: { error: 1, message: res.data.error } });
                setInterval(() => {
                    setMsg({ type: "CLEAR" })
                }, 10000)
            }
            setuserName("")
            setEmail("")
            setPassword("")
            setImage("")
        }).catch(err => {
            const errormessage=err.response.data.error || "Some error Occured";
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
                    <h1 className="text-center mx-auto">Register Form</h1>
                    <form onSubmit={post} noValidate className='validated-form'>
                        <div className="mb-1">
                            <label className="form-label" htmlFor="username">Username</label>
                            <input className="form-control" type="text" id="username" value={username} onChange={(e) => { setuserName(e.target.value) }} required></input>
                            <div className="valid-feedback">Looks good</div>
                        </div>
                        <div className="mb-1">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input className="form-control" type="email" id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required></input>
                            <div className="valid-feedback">Looks good</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input className="form-control" type="password" id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} required></input>
                            <div className="valid-feedback">Looks good</div>
                        </div>
                        <div className="input-group mb-3">
                            <div className="custom-file">
                                <input type="file" className="custom-file-input" id="image" onChange={(e) => { setImage(e.target.files[0]) }} aria-describedby="inputGroupFileAddon01"></input>
                                <label className="custom-file-label" htmlFor="image">{image ? image.name : 'Choose an image..'}</label>
                            </div>
                        </div>
                        <div className="mb-1 text-center">
                            <button className="btn btn-success">Register</button>
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
