import React, { useContext, useEffect, useState } from 'react'
import PostList from '../../../../components/post/PostList'
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { View } from 'react-native'

export const PostHistory = ( { navigation } ) => {
  const { onRefresh, loading } = useContext( FoodCardContext )
  const [ posts, setPosts ] = useState( [] )
  const [ error, setError ] = useState( null )
  
  const updatePosts = ( update ) => {
    if ( !update ) {
        setError( new Error( 'refreshPosts: yielded no new updates' ) )
        return
    }
    setPosts( update )
  }
  
  const refresh = () => {
    onRefresh({setResult : updatePosts})
  }


  useEffect( () => {
    refresh()
  }, [])
  
  return (
      <PostList DATA={posts} refreshing={loading} onRefresh={() => refresh()} />
  )
}