import React, { useCallback, useContext, useEffect, useState } from 'react'
import PostList from '../../../../components/post/PostList'
import { FoodCardContext } from '../../../../context/FoodCardContext'
import VendorCard from '../../../../components/post/VendorCard'
import { View } from 'react-native'
import Container from '../../../../components/styling/Container'
import { SafeAreaView } from 'react-native-safe-area-context'


export const PostHistory = ( { navigation, route } ) => {
  const { onRefresh, loading } = useContext( FoodCardContext )
  const [ posts, setPosts ] = useState( [] )
  const [ error, setError ] = useState( null )
  const {refresh: trigger} = route.params ? route.params.refresh : false

  
  // idk why this won't let me commit
  

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
    if (!trigger)
    refresh()
  }, [])

  useEffect( () => {
    if (!trigger) return 
    refresh()
  }, [trigger])

  const refreshPostHistory = useCallback(() => {
    refresh()
  },[refresh])
  
  useEffect( () => {
    console.log(posts)
  }, [ setPosts ] )

  useEffect( () => {
    if (! error) return
    console.log(error)
  }, [error, setError])
  
  return (
    <View style={{}}>
      <PostList DATA={posts} refreshing={loading} onRefresh={() => refresh()} Alternative={props => <VendorCard {...{...props, refreshPostHistory}} />}  />
    </View>
      
      
    
    
  )
}