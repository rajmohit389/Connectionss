import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'

function Comment({ postId, commenttorender }) {
    const [comment, setComment] = useState(commenttorender)
    const { state } = useContext(UserContext)

    const deleteComment = () => {
        fetch(`/posts/${postId}/comments/${comment._id}`, {
            method: "delete",
        }).then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setComment(null)
                }
            }).catch(err => {
                // console.log(err)
            })
    }

    const likeComment = () => {
        fetch(`/posts/${postId}/comments/likeComment/${comment._id}`, {
            method: 'PUT'
        }).then(res => res.json()).then(data => {
            if (!data.error) {
                setComment({ ...comment, likes: data.likes })
            }
        }).catch(err => {
            // console.log(err)
        })
    }

    const unlikeComment = () => {
        fetch(`/posts/${postId}/comments/unlikeComment/${comment._id}`, {
            method: 'PUT',
        }).then(res => res.json()).then(data => {
            if (!data.error) {
                setComment({ ...comment, likes: data.likes })
            }
        }).catch(err => {
            // console.log(err)
        })
    }

    return (
        <>
            {(comment && state) ?
                <div className={'my-2 mx-2 px-3 py-2'} style={{ borderRadius: "15px", backgroundColor: "#E8E2E2" }}>
                    {(comment.commentedBy._id.toString() === state._id.toString()) &&
                        <i className="fa-solid fa-trash fa-lg float-right px-2 pt-2" style={{ cursor: "pointer", color: '#E42525' }} onClick={deleteComment}></i>
                    }
                    <h6><Link to={comment.commentedBy._id.toString() === state._id.toString() ? "/profile" : "/users/" + comment.commentedBy._id + "/v"}>{comment.commentedBy.username}</Link></h6>
                    <pre style={{ fontSize: '15px' }} >{comment.text}</pre>
                    {comment.likes.includes(state._id) ?
                        <i className="fa-solid fa-thumbs-up my-0 mx-2 fa-lg" id={"thumbcomment" + comment._id} style={{ cursor: "pointer", color: '#1840E0' }} onClick={unlikeComment}></i>
                        :
                        <i className="fa-regular fa-thumbs-up my-0 mx-2 fa-lg" id={"thumbcomment" + comment._id} style={{ cursor: "pointer" }} onClick={likeComment}></i>
                    }
                    <p className='px-2'>{comment.likes.length}</p>
                </div>
                :
                <></>
            }
        </>
    )
}

export default React.memo(Comment)