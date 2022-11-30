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
import Container from '../../../../components/styling/Container'
import { Detail } from '../../../vendor/screens/view-post-feature/utils/EditDetail'
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { toTitleCase } from '../../../vendor/screens/view-post-feature/utils'

// TODO: move to config for testing
export const Orders = ({navigation, route}) => {
    const { onRefresh, loading: refreshing, orders, onViewActiveOrders } = useContext( FoodCardContext )
    const [ posts, setPosts ] = useState( orders )
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

    // const renderListEmptyComponent = () => (
    //     <View>
    //         <Text>
    //             No active orders!
    //         </Text>
    //     </View>
    // )

    const renderListEmptyComponent = ( { backgroundColor='#fff', item = 'Woops...', description = 'No orders found, go ahead and reserve an order first!'} = {} ) => {
      return (
      <Container paddingTop={100} >
        <View backgroundColor={backgroundColor} borderRadius={10} flexDirection='column' style={{alignItems: 'center', height: 300, justifyContent: 'center'}}>
              <View>
              <MaterialIcons name="no-meals-ouline" size={80} color="black" />
              </View>
              <View style={{alignItems: 'center',padding: 10}}>
              <Detail fullLength={true} icon={props => <Ionicons name="alert" {...props} />} label={` ${ item }`} description={description} />
              </View>
        </View>
      </Container>
  )}
    
  const updatePosts = ( update ) => {
    if ( !update ) {
        setError( new Error( 'refreshPosts: yielded no new updates' ) )
        return
    }
    setPosts( update )
  }
  
  const refresh = () => {
    onViewActiveOrders()
    setPosts(orders)
  }

  useEffect( () => {
    if (!trigger) return 
    refresh()
  }, [trigger])
  
  useEffect( () => {
    if (! error) return
    console.log(error)
  }, [ error, setError ] )

  useEffect( () => {
    if (! orders) return
    onViewActiveOrders()
  }, [] )

  useEffect( () => {
    if(!trigger) return
    refresh()
    trigger = false
}, [ refreshing ] )
    

    return (
        
        <View>
            <Title>Orders</Title>
            <View style={{}}>
                <PostList DATA={posts} ListEmptyComponent={renderListEmptyComponent} refreshing={refreshing} onRefresh={() => refresh()} Alternative={props => <PostCard {...{ ...props, ExpandedPost: 'EditOrder' }} />} />
            </View>
        </View>
    )
}





