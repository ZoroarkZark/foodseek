import React, { useState } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import PostCard from './PostCard'

// creates a list of postcards
const PostList = (props) => {
    const [selectedId, setSelectedId] = useState(props.extraData)

    return (
        <FlatList
            data={props.DATA}
            renderItem={({ item, expandPost }) => (
                <PostCard data={item} expandPost={expandPost} />
            )}
            keyExtractor={( data ) => data.id}
            refreshControl={
                <RefreshControl refreshing={props.refreshing} onRefresh={props.onRefresh} />
            }
            extraData={props.refreshing}
        />
    )
}

export default PostList
