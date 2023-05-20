import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext, MsgContext } from '../../App'

export default function Nav() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("")
    const [userList, setUserList] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const { setMsg } = useContext(MsgContext)
    const logOut = () => {
        fetch('/logout').then(res => res.json()).then(result => {
            if (result.error) {
                dispatch({ type: "CLEAR" });
                setMsg({ type: "UPDATE", payload: { error: 1, message: result.error } });
                setInterval(() => {
                    setMsg({ type: "CLEAR" })
                }, 10000)
            }
            else {
                const userName = state.username;
                dispatch({ type: "CLEAR" });
                setMsg({ type: "UPDATE", payload: { error: 0, message: "Goodbye! See you back soon " + userName } });
                setInterval(() => {
                    setMsg({ type: "CLEAR" })
                }, 10000)
                navigate('/login');
            }

        }).catch(err => {
            const errormessage = err.response.data.error || "Some error Occured";
            setMsg({ type: "UPDATE", payload: { error: 1, message: errormessage } });
            setInterval(() => {
                setMsg({ type: "CLEAR" })
            }, 10000)
        })
    }

    const renderList = () => {
        if (state) {
            return [
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg"><i className="fa-solid fa-magnifying-glass"></i></button>,
                <li className="nav-item active" key="1">
                    <Link className="nav-link" to="/profile">Profile</Link>
                </li>,
                <li className="nav-item active" key="2">
                    <Link className="nav-link" to="/createpost">CreatePost</Link>
                </li>,
                <li className="nav-item active" key="3">
                    <Link className="nav-link" to="/subposts">SubPosts</Link>
                </li>,
                <li className="nav-item active" key="4">
                    <button type="button" className="btn btn-sm btn-danger nav-link" onClick={logOut}>Logout</button>
                </li>
            ]
        }
        else {
            return [
                <li className="nav-item active" key="5">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>,
                <li className="nav-item active" key="6">
                    <Link className="nav-link" to="/register">Register</Link>
                </li>
            ]
        }
    }
    useEffect(() => {
        if (search && state) {
            fetch(`/users/searchUsers?search=${search}`).then(res => res.json())
                .then(data => {
                    if (data.users) {
                        setUserList(data.users);
                    }
                    else {
                        setUserList(null);
                    }
                })
        }
        else {
            setUserList(null);
        }
    }, [search, state])
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to={state ? '/' : '/login'} >Connections</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        {renderList()}
                    </ul>
                </div>
                {state && <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <input type="text" className="form-control" value={search} onChange={(e) => { setSearch(e.target.value) }} placeholder="Enter the username" />
                            {userList && <ul className="list-group">
                                {userList.map((item) => {
                                    return (
                                        <li className="list-group-item border border-success" key={item._id} ><Link to={item._id.toString() === state._id.toString() ? "/profile" : "/users/" + item._id + "/v"} onClick={() => {
                                            // document.querySelector('.bd-example-modal-lg').modal('close')
                                        }}>{item.username}</Link></li>
                                    )
                                })}
                            </ul>}
                        </div>
                    </div>
                </div>}


            </nav>

        </>
    )
}
