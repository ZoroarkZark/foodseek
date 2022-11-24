import React, { useContext, useEffect, useState } from 'react'
import PostList from '../../../../components/post/PostList'
import { FoodCardContext } from '../../../../context/FoodCardContext'
import VendorCard from '../../../../components/post/VendorCard'
import { View } from 'react-native'
import Container from '../../../../components/styling/Container'
import { SafeAreaView } from 'react-native-safe-area-context'


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
  
  useEffect( () => {
    console.log(posts)
  }, [ setPosts ] )

  useEffect( () => {
    if (! error) return
    console.log(error)
  }, [error, setError])
  
  return (
    <View style={{}}>
      <PostList DATA={posts} refreshing={loading} onRefresh={() => refresh()} Alternative={props => <VendorCard {...{...props, onRefresh: () => refresh()}} />}  />
    </View>
      
      
    
    
  )
}