import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import PostComponent from './PostComponent'

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    if (state) {
      fetch('/posts/allposts').then(res => res.json()).then(result => {
        if (!result.error) {
          setPosts(result.posts);
        }
      })
    }
  }, [state])

  return (
    <div className='mt-3'>
      {
        posts.map((post) => {
          return (
            // <h1>{post._id}</h1>
            <PostComponent key={post._id} posttorender={post} />
          )
        })
      }
    </div>
  )
}
