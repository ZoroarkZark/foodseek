import React from 'react'
import { RefreshControl, SectionList } from 'react-native'
import PostCard from '../../../../components/post/PostCard'

export const PostsSection = ({DATA, renderSectionHeader, ListHeaderComponent, refreshing, onRefresh}) => {
  return (
    <SectionList 
      ListHeaderComponent={ListHeaderComponent}
      sections={[
        {
          data: DATA,
          keyExtractor: ( data ) => data.id,
          renderItem: ( { item, expandPost } ) => ( <PostCard data={item} expandPost={expandPost} /> ),
          
        },
        
      ]}
      refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
      extraData={refreshing}
    />
  )
}