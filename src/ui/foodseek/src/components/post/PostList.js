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
                renderItem={({ item, expandPost, setFavorite }) => 
                    <PostCard 
                    data={item} 
                    expandPost={expandPost} 
                    setFavorite={setFavorite} />
                }
                keyExtractor={(data) => data.id}
                extraData={selectedId}
            />
    );
}

const styles = StyleSheet.create({
    column: {
        flex: 1,
        flexDirection: 'column', 
        alignContent: 'center'
    },
    row: {
        flex:1,
        flexDirection: 'row', 
        alignContent:'space-between'
    },
    title: {
        flex: 1,
        fontSize: 18,
        textAlign: 'left',
        fontWeight: 'bold',
        paddingVertical: 4
    },
    favorite: {
        flex: 1,
        color: 'grey',
        backgroundColor: '#fff',
        fontSize: 16,
        textAlign: 'right',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        paddingVertical: 4,
      },
    subtextLeft: {
        flex: 1,
        fontSize: 16,
        color: 'grey',
        textAlign: 'left',
    },
    subtextRight: {
        flex: 1,
        fontSize: 16,
        color: 'grey',
        textAlign: 'right',
      },
  });

  export default PostList;