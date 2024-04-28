'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Profile from '../../components/Profile/Profile'

const MyProfile = () => {
    const router = useRouter()
    const {data : session} = useSession()
    const [posts, setPosts] = useState([])

    const fetchPosts = async () => {
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        const data = await response.json();
    
        setPosts(data);
      };
    useEffect(() => {
        if(session?.user.id) 
          fetchPosts()
    },[session?.user.id])
    const handleEdit = (post) => {
      router.push(`/update-prompt?id=${post._id}`)
    }
    const handleDelete = async (post) => {
      const hasConfirmed = confirm(
        "Are you sure you want to delete this prompt?"
      );
  
      if (hasConfirmed) {
        try {
          await fetch(`/api/prompt/${post._id.toString()}`, {
            method: "DELETE",
          });
  
          const filteredPosts = posts.filter((item) => item._id !== post._id);
  
          setPosts(filteredPosts);
        } catch (error) {
          console.log(error);
        }
      }
    };

  return (
    <Profile 
    name = {session?.user.name}
    desc = "Welcome to my Page"
    data = {posts}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    />

  )
}

export default MyProfile