import React, { useContext, useCallback, useState } from 'react'
import { ScrollViewDismissKeyboard } from '../../../../components/common'
import PostList from '../../../../components/post/PostList' // import the component with the implemented flatlist
import { DATA } from '../../../../components/post/TestData' // import some local dummy data for demo purposes
import { FoodCardContext } from '../../../../context/FoodCardContext'

// Returns a PostList to display a list of available vendor posts to the user
export const Posts = ( { navigation } ) => {
    const { cards, onRefresh, loading } = useContext( FoodCardContext )

    return (
        <PostList DATA={cards ? cards : DATA} refreshing={loading} onRefresh={() => onRefresh()} /> 
    )
}
