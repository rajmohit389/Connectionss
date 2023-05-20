import React, { useContext, useEffect, useState } from 'react'
import { UserContext, MsgContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CreatePost() {
    const { state } = useContext(UserContext)
    const { setMsg } = useContext(MsgContext)
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([]);
    const [label, setLabel] = useState("Choose img(s)...")
    useEffect(() => {
        var str = "";
        Array.from(images).forEach(image => {
            str += `${image.name}, `
        })
        if (str) {
            setLabel(str);
        }
        else {
            setLabel("Choose img(s)...")
        }
    }, [images])
    const createPost = (e) => {
        e.preventDefault()
        setMsg({ type: "UPDATE", payload: { error: 0, message: "In Process......." } });
        const data = new FormData()
        data.append('title', title)
        data.append('description', description)
        Array.from(images).forEach(image => {
            data.append('images', image)
        })
        axios.post('/posts', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            if (!res.data.error) {
                setMsg({ type: "UPDATE", payload: { error: 0, message: res.data.message } });
                setInterval(() => {
                    setMsg({ type: "CLEAR" })
                }, 10000)
                navigate(`/posts/${res.data.post._id}/v`)
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
            {(state) ?
                <div className="row">
                    <div className="offset-3 appForm">
                        <h1 className="text-center mx-auto">New Post</h1>
                        <form onSubmit={createPost} noValidate className="validated-form">
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
                            <div className="mb-1 text-center">
                                <button className="btn btn-success">Add a Post</button>
                            </div>
                        </form>
                    </div>
                </div>
                :
                <></>}
        </>

    )
}
