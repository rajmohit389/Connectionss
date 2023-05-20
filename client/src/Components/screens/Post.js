import React, { useState, useEffect, useContext } from 'react'
import { UserContext, MsgContext } from '../../App'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'


function Post() {
    const { setMsg } = useContext(MsgContext)
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const { state } = useContext(UserContext)
    const navigate = useNavigate();
    const [myComments, setmyComments] = useState(null);

    useEffect(() => {
        if (state) {
            fetch(`/posts/${postId}`).then(res => res.json()).then(data => {
                if (!data.error) {
                    let thepost = data.post;
                    let commentsArr = data.post.comments
                    let sorted = [...commentsArr].sort((a, b) => (b.likes.length - a.likes.length))
                    thepost.comments = sorted;
                    setPost(thepost);
                }
            }).catch(err => {
                // console.log(err)
            })
        }
    }, [postId, state])

    useEffect(() => {
        if (state && post) {
            const mineComments = post.comments.filter((element) => {
                if ((element.commentedBy._id).toString() === (state._id).toString()) {
                    return element;
                }
            })
            setmyComments(mineComments)
        }
    }, [post, state])

    const deletePost = () => {
        setMsg({ type: "UPDATE", payload: { error: 0, message: "In Process......." } });
        fetch(`/posts/${postId}`, {
            method: "delete",
        }).then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setMsg({ type: "UPDATE", payload: { error: 0, message: data.message } });
                    setInterval(() => {
                        setMsg({ type: "CLEAR" })
                    }, 10000)
                    navigate('/');
                }
                else {
                    setMsg({ type: "UPDATE", payload: { error: 1, message: data.error } });
                    setInterval(() => {
                        setMsg({ type: "CLEAR" })
                    }, 10000)
                }
            }).catch(err => {
                const errormessage = err.response.data.error || "Some error Occured";
                setMsg({ type: "UPDATE", payload: { error: 1, message: errormessage } });
                setInterval(() => {
                    setMsg({ type: "CLEAR" })
                }, 10000)
            })
    }

    const likePost = () => {
        fetch(`/posts/likePost/${post._id}`, {
            method: "PUT"
        }).then(res => res.json()).then(data => {
            if (!data.error) {
                setPost({ ...post, likes: data.likes })
            }
        }).catch(err => {
            // console.log(err);
        })
    }

    const unlikePost = () => {
        fetch(`/posts/unlikePost/${post._id}`, {
            method: "PUT"
        }).then(res => res.json()).then(data => {
            if (!data.error) {
                setPost({ ...post, likes: data.likes })
            }
        }).catch(err => {
            // console.log(err);
        })
    }

    const createComment = (text) => {
        if (text) {
            fetch(`/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text
                })
            }).then(res => res.json()).then(data => {
                if (!data.error) {
                    const newComments = [...post.comments, data.comment]
                    setPost({ ...post, comments: newComments })
                }
            }).catch(err => {
                // console.log(err);
            })
        }
    }

    return (
        <>
            {(post && state) ?
                <div className="shadow-lg post px-1 py-2 mb-4 bg-white rounded container">
                    <div className="container pt-2">
                        {post.postedBy._id.toString() === state._id.toString() &&
                            <i className="fa-solid fa-trash fa-xl" onClick={deletePost} style={{ cursor: "pointer", color: '#E42525' }}></i>
                        }
                        {post.postedBy._id.toString() === state._id.toString() &&
                            <Link to={"/posts/" + post._id + "/edit"}><button className='btn btn-info float-right'>Edit</button></Link>
                        }
                    </div>
                    <h3 className="container mt-2"><Link to={post.postedBy._id.toString() === state._id.toString() ? "/profile" : "/users/" + post.postedBy._id + "/v"}>{post.postedBy.username}</Link></h3>
                    <h2 className='container'>{post.title}</h2>
                    <pre style={{ fontSize: '20px' }} className='container' >{post.description}</pre>
                    {post.images && <div id="carouselPost" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {
                                post.images.map((img, i) => {
                                    return (
                                        <div className={"carousel-item " + (i === 0 ? 'active' : '')} >
                                            <img className="d-block w-100" src={img.url} alt={"slide" + i + 1}></img>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <a className="carousel-control-prev" href="#carouselPost" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselPost" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>}
                    <div className="px-2 py-3">
                        {post.likes.includes(state._id) ?
                            <i className="fa-solid fa-thumbs-up my-2 mx-2 fa-xl" id={"thumb" + post._id} style={{ cursor: "pointer", color: '#1840E0' }} onClick={unlikePost}></i>
                            :
                            <i className="fa-regular fa-thumbs-up my-2 mx-2 fa-xl" id={"thumb" + post._id} style={{ cursor: "pointer" }} onClick={likePost}></i>
                        }
                        <h5 className='container px-2'>{post.likes.length}</h5>
                    </div>
                    <form className="d-flex" onSubmit={(e) => {
                        e.preventDefault()
                        createComment(e.target[0].value)
                        e.target[0].value = "";
                    }}>
                        <textarea className='container mx-2' placeholder='Add a comment' ></textarea>
                        <button type="submit" className='btn btn-info'><i class="fa-solid fa-paper-plane fa-lg"></i></button>
                    </form>
                    <div className="card">
                        <div className="card-header" style={{ borderWidth: '3px' }}>

                        </div>
                        {myComments ?
                            <div className="card-body">
                                {myComments.map((comment) => {
                                    return (
                                        <Comment key={comment._id} postId={post._id} commenttorender={comment} delete={true} />
                                    )
                                })}
                            </div>
                            :
                            <></>
                        }
                        <hr style={{ borderWidth: '2px', borderStyle: 'solid' }}></hr>
                        <h3 style={{ color: 'blue' }} className="container mt-2 mx-2">All Comments</h3>
                        <div className="card-body">
                            {post.comments.map((comment) => {
                                return (
                                    <Comment key={comment._id} postId={post._id} commenttorender={comment} delete={false} />
                                )
                            })}
                        </div>
                    </div>
                </div>
                :
                <></>
            }
        </>
    )
}

export default React.memo(Post)