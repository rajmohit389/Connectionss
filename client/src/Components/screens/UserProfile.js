import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import PostComponent from './PostComponent'

export default function UserProfile() {
    const navigate = useNavigate();
    const [userdetails, setUserdetails] = useState(null);
    const [posts, setPosts] = useState([])
    const { state } = useContext(UserContext)
    const { userId } = useParams();

    useEffect(() => {
        if (state) {
            if (userId.toString() === state._id.toString()) {
                navigate('/profile')
            }
            fetch(`/users/${userId}`).then(res => res.json()).then(result => {
                if (!result.error) {
                    setPosts(result.posts);
                    setUserdetails(result.user);
                }
            })
        }
    }, [userId, state])

    const followUser = (followId) => {
        fetch(`/users/follow/${followId}`, {
            method: "PUT"
        }).then(res => res.json()).then(data => {
            if (!data.error) {
                setUserdetails(data.otherUser)
            }

        })
    }

    const unfollowUser = (unfollowId) => {
        fetch(`/users/unfollow/${unfollowId}`, {
            method: "PUT"
        }).then(res => res.json()).then(data => {
            if (!data.error) {
                setUserdetails(data.otherUser)
            }
        })
    }

    return (
        <>
            {userdetails && state ?
                <>
                    <div className="shadow-lg bg-white card mt-3 container px-0"  id="profile" style={{ border: "1px solid" }}>
                        <div className="card-header text-center my-0" style={{ border: "1px solid", backgroundColor: "#c7d7d8" }}>
                            <h2>{userdetails.username}</h2>
                        </div>
                        <div className="card-body row">
                            <h5 className="card-title col">
                                <img src={userdetails.pic.url} style={{ height: "100%", width: "60%" }} className="rounded float-left ml-3" alt="..."></img>
                            </h5>
                            <p className="card-text col">
                                <h4 className='justify-content-center mt-2'>Email:<span>{userdetails.email}</span></h4>
                                <div className="row justify-content-center mr-4">
                                    <div className="col">{userdetails.followers.length} followers</div>
                                    <div className="col">{userdetails.followings.length} followings</div>
                                    <div className="col">{posts.length} Posts</div>
                                    {userdetails.followers.includes(state._id) ?
                                        <button type="button" className="btn btn-sm btn-primary py-0" onClick={(e) => {
                                            unfollowUser(userdetails._id)
                                        }}>Unfollow</button> :
                                        <button type="button" className="btn btn-sm btn-primary py-0" onClick={(e) => {
                                            followUser(userdetails._id)
                                        }}>Follow</button>}
                                </div>
                            </p>
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
