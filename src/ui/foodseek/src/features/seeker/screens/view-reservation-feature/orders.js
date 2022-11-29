import React, { useContext, useEffect, useState, useCallback} from 'react'
import { Text, View } from 'react-native'
import { Title } from '../../../../components/common'
import PostList from '../../../../components/post/PostList'
import PostCard from '../../../../components/post/PostCard'

// globals: imports provide the food card services and location services
import { FoodCardContext } from '../../../../context/FoodCardContext'

// Provides Odin
import { Odin } from '../../../../components/common/Odin'
import { Button } from 'react-native-rapi-ui'

// TODO: move to config for testing
export const Orders = ({navigation, route}) => {
    const { onRefresh, loading, orders, onViewActiveOrders } = useContext( FoodCardContext )
    const [ posts, setPosts ] = useState( [] )
    const [ error, setError ] = useState( null )
    let {refresh: trigger} = route.params ? route.params.refresh : false
    

    
    // defines the props for the Posts SectionList (the view for the screen)
    function fieldCheck (field){
        var newField; 
        if (field)
            newField = field
        else
            newField = "NULL"
        return newField;
    }

    const renderListEmptyComponent = () => (
        <View>
            <Text>
                No active orders!
            </Text>
        </View>
    )

    
  const updatePosts = ( update ) => {
    if ( !update ) {
        setError( new Error( 'refreshPosts: yielded no new updates' ) )
        return
    }
    setPosts( update )
  }
  
  const refresh = () => {
    onViewActiveOrders()
  }

  useEffect( () => {
    if (!trigger) return 
    refresh()
  }, [trigger])
  
  useEffect( () => {
    console.log(posts)
  }, [ setPosts ] )

  useEffect( () => {
    if (! error) return
    console.log(error)
  }, [ error, setError ] )

  useEffect( () => {
    if (! orders) return
    onViewActiveOrders()
  }, [] )
    

    return (
        
        <View>
            <Title>Orders</Title>
            <View style={{}}>
                <PostList ExpandedPost='EditOrder' DATA={orders} ListEmptyComponent={renderListEmptyComponent} refreshing={loading} onRefresh={() => refresh()} Alternative={props => <PostCard {...{ ...props }} />} />
            </View>
        </View>
    )
}





