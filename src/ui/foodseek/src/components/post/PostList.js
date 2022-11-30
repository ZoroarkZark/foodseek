import { FontAwesome5 } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { Detail } from '../../features/vendor/screens/view-post-feature/utils/EditDetail'
import Container from '../styling/Container'
import PostCard from './PostCard'

// creates a list of postcards
const PostList = ( props ) => {
    const [ selectedId, setSelectedId ] = useState( props.extraData )
    const { Alternative } = props
    const { ListEmptyComponent } = props
    const renderListEmptyComponent = ( { backgroundColor='#fff', item = 'Woops...', description = 'No results were found, please restart your app, change your input, or try to refresh!'} = {} ) => {
        return (
        <Container paddingTop={100} >
          <View backgroundColor={backgroundColor} borderRadius={10} flexDirection='column' style={{alignItems: 'center', height: 300, justifyContent: 'center'}}>
                <View>
                    <FontAwesome5 name="sad-tear" size={50} color="black" />   
                </View>
                <View style={{alignItems: 'center',padding: 10}}>
                <Detail fullLength={true} icon={props => <Ionicons name="alert" {...props} />} label={` ${ item }`} description={description} />
                </View>
          </View>
        </Container>
    )}

    if ( !Alternative ) {
        return (
        <FlatList
            data={props.DATA}
            renderItem={( { item, expandPost } ) => (
                <PostCard data={item} expandPost={expandPost} />
                )}
            ListEmptyComponent={ListEmptyComponent ? ListEmptyComponent : renderListEmptyComponent}
            keyExtractor={( data ) => data.id}
            refreshControl={
                <RefreshControl refreshing={props.refreshing} onRefresh={props.onRefresh} />
            }
            extraData={props.refreshing}
        />
        )
    } else {
        return (
        <FlatList
            data={props.DATA}
            renderItem={( { item, expandPost } ) => (
                <Alternative data={item} expandPost={expandPost} />
            )}
            ListEmptyComponent={ListEmptyComponent ? ListEmptyComponent : renderListEmptyComponent}
            keyExtractor={( data ) => data.id}
            refreshControl={
                <RefreshControl refreshing={props.refreshing} onRefresh={props.onRefresh} />
            }
            extraData={props.refreshing}
        />
    )}
    
}

export default PostList
