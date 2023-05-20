import React, { useState, useEffect, useContext } from 'react'
import { UserContext, MsgContext } from '../../App'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function EditPost() {
    const { state } = useContext(UserContext)
    const { setMsg } = useContext(MsgContext)
    const [post, setPost] = useState(null)
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])
    const [label, setLabel] = useState("Add img(s)...")
    const [deleteImages, setDeleteImages] = useState([])
    const { postId } = useParams()

    useEffect(() => {
        if (state) {
            fetch(`/posts/${postId}`).then(res => res.json()).then(data => {
                if (!data.error) {
                    setPost(data.post)
                    // console.log(data.post)
                }
            }).catch(err => {
                // console.log(err)
            })
        }
    }, [state, postId])

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setDescription(post.description)
        }
    }, [post])

    useEffect(() => {
        var str = "";
        Array.from(images).forEach(image => {
            str += `${image.name}, `
        })
        if (str) {
            setLabel(str);
        }
        else {
            setLabel("Add img(s)...")
        }
    }, [images])

    const editPost = (e) => {
        e.preventDefault()
        const data = new FormData()
        setMsg({ type: "UPDATE", payload: { error: 0, message: "In Process......." } });
        data.append('title', title)
        data.append('description', description)
        Array.from(images).forEach(image => {
            data.append('images', image)
        })
        Array.from(deleteImages).forEach(image => {
            data.append('deleteImages', image)
        })
        axios.put(`/posts/${postId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            if (!res.data.error) {
                setMsg({ type: "UPDATE", payload: { error: 0, message: res.data.message } });
                setInterval(() => {
                    setMsg({ type: "CLEAR" })
                }, 10000)
                navigate(`/posts/${postId}/v`)
            }
            else {
                setMsg({ type: "UPDATE", payload: { error: 1, message: res.data.error } });
                setInterval(() => {
                    setMsg({ type: "CLEAR" })
                }, 10000)
            }
            setTitle("")
            setDescription("")
            setImages([]);
            setDeleteImages([])
            setLabel("Add img(s)...")
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
            {(post && state) ?
                <div className="row mb-5">
                    <div className="offset-3 appForm">
                        <h1 className="text-center mx-auto">Edit Post</h1>
                        <form onSubmit={editPost} noValidate className="validated-form">
                            <div className="mb-1">
                                <label className="form-label" htmlFor="title">Title</label>
                                <input className="form-control" type="text" id="title" value={title} onChange={(e) => { setTitle(e.target.value) }} required></input>
                                <div className="valid-feedback">Looks good</div>
                            </div>
                            <div className="mb-1">
                                <label className="form-label" htmlFor="description">Description</label>
                                <textarea className="form-control" type="text" id="description" value={description} onChange={(e) => { setDescription(e.target.value) }} required></textarea>
                                <div className="valid-feedback">Looks good</div>
                            </div>
                            <div className="input-group mb-3">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="images" aria-describedby="inputGroupFileAddon01" onChange={(e) => { setImages(e.target.files) }} multiple></input>
                                    <label className="custom-file-label" htmlFor="images">{label}</label>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                {post.images.map((img, i) => {
                                    return (
                                        <div class="col-5">
                                            <img src={img.url} class="img-thumbnail" alt=""></img>
                                            <div class="form-check-inline">
                                                <input type="checkbox" id={"img " + i + 1} value={img.filename} onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (e.target.checked) {
                                                        setDeleteImages([...deleteImages, value])
                                                    } else {
                                                        setDeleteImages(deleteImages.filter((e) => (e !== value)))
                                                    }

                                                }} ></input>
                                            </div>
                                            <label for={"img " + i + 1}>Delete?</label>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mb-1 text-center">
                                <button className="btn btn-info">Update Post</button>
                            </div>
                        </form>
                    </div>
                </div>
                :
                <></>
            }
        </>
    )
}
