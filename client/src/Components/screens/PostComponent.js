import React, { useState, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

function PostComponent({ posttorender }) {
    const [post, setPost] = useState(posttorender)
    const { state } = useContext(UserContext)

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

    return (
        <>
            {(post && state) ?
                <div className="shadow-lg post px-1 py-2 mb-4 bg-white rounded container" >
                    <h3 className="container"><Link to={post.postedBy._id.toString() === state._id.toString() ? "/profile" : "/users/" + post.postedBy._id +"/v"}>{post.postedBy.username}</Link></h3>
                    <h2 className='container'>{post.title}</h2>
                    <pre style={{ fontSize: '20px' }} className='container'>{post.description}</pre>
                    {post.images && <div id={"carouselPost"+post._id} className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {
                                post.images.map((img, i) => {
                                    return (
                                        <div className={"carousel-item " + (i === 0 ? 'active' : '')}>
                                            <img className="d-block w-100" src={img.url} alt={"slide" + i + 1}></img>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <a className="carousel-control-prev" href={"#carouselPost" + post._id} role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href={"#carouselPost" + post._id} role="button" data-slide="next">
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
                        <h5 className='container px-1'>{post.likes.length}</h5>
                    </div>
                    <h4 className="container" style={{fontSize:'15px'}}><Link to={"/posts/" + post._id + "/v"}>Add a Comment/View Comments</Link></h4>
                </div>
                :
                <></>
            }
        </>
    )
}

export default React.memo(PostComponent)
