import React, { useState, useEffect, useContext } from 'react'
import PostComponent from './PostComponent'
import { UserContext } from '../../App';

export default function SubPosts() {
  const [posts, setPosts] = useState([]);
  const { state } = useContext(UserContext)

  useEffect(() => {
    if (state) {
      fetch('/posts/getsubposts').then(res => res.json()).then(result => {
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
            <PostComponent key={post._id} posttorender={post} />
          )
        })
      }
    </div>
  )
}
