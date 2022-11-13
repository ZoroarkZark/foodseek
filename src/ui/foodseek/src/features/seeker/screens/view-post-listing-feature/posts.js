import React, { useContext, useCallback, useState, useEffect } from 'react'
import { ScrollViewDismissKeyboard } from '../../../../components/common'
import PostList from '../../../../components/post/PostList' // import the component with the implemented flatlist
import { DATA } from '../../../../components/post/TestData' // import some local dummy data for demo purposes
import { FoodCardContext } from '../../../../context/FoodCardContext'

// Returns a PostList to display a list of available vendor posts to the user
export const Posts = ( { navigation } ) => {
    const { cards, test, onRefresh, loading } = useContext( FoodCardContext )

    // TODO sql server keeps going down but we need to operate on cards so this just sets the default cards before anything
    useEffect( () => {
        test(DATA)      
    }, [] )
    

    return (
        <PostList DATA={cards ? cards : DATA} refreshing={loading} onRefresh={() => onRefresh()} /> 
    )
}
