import React, { useState } from "react";
import { FlatList } from "react-native";
import { StyleSheet} from 'react-native';
import PostCard from './PostCard';

// creates a list of postcards
 const PostList = props => {
    const [selectedId, setSelectedId] = useState(null);

    return (

            <FlatList
                data={props.DATA}
                renderItem={({ item, expandPost}) => 
                    <PostCard 
                    data={item} 
                    expandPost={expandPost} 
                     />
                }
                keyExtractor={(data) => data.id}
                extraData={selectedId}
            />
    );
}

export default PostList;