import React from 'react'
import { RefreshControl, SectionList } from 'react-native'
import PostCard from '../../../../components/post/PostCard'

// Posts Section List is a SectionList that produces a search bar, filter buttons, and a list of post cards for display (SectionList: https://reactnative.dev/docs/sectionlist)
export const PostsSectionList = props => {
  const {data, ListHeaderComponent, refreshing, onRefresh} = props
  return (
    <SectionList 
      keyboardShouldPersistTaps='handled'
      ListHeaderComponent={ListHeaderComponent}
      sections={[
        {
          data: data,
          keyExtractor: ( data ) => data.id,
          renderItem: ( { item, expandPost } ) => ( <PostCard data={item} expandPost={expandPost} /> ),
          
        },
        
      ]}
      refreshing={refreshing}
      onRefresh={() => onRefresh()}
      refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
      extraData={refreshing}
    />
  )
}