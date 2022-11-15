// TODO: remove this dummy data and move to config or testing
import { DATA } from '../../../../components/post/TestData' 
import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native'

// globals: imports provide the food card services and location services
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { LocationContext } from '../../../../context/LocationContext'

// rendering: imports provide the viewable components to render
import { PostsSectionList } from './PostsSectionList'
import { PostsListHeaderComponent } from './PostsListHeaderComponent'

// TODO: move to config for testing
const DEFAULT_CARD_ARRAY = DATA ? DATA : []

// Returns a PostList to display a list of available vendor posts to the user
export const Posts = ( { navigation } ) => {
    // error and data storage for the post screen component
    const [ error, setError ] = useState( null )
    const [ posts, setPosts ] = useState( DEFAULT_CARD_ARRAY )
    const [ sort, setSort ] = useState( null )
    const [ tags, setTags ] = useState( null )
    

    // context classes for location and food card providers
    const {location: loc, keyword: key } = useContext(LocationContext)
    const { onRefresh, loading: refreshing, setLoading } = useContext( FoodCardContext )

    // search term and coordinates
    const [ keyword, setKeyword ] = useState( key )
    const [ location, setLocation ] = useState( loc )


    const sortList = [ 'Nearest', 'Newest', 'Oldest' ]
    const tagList = ['Chinese', 'Thai', 'Mexican']
    const style = {}
    

    // updatePosts function wraps the posts structure to prevent rewriting the list when the server response was empty
    const updatePosts = ( update ) => {
        if ( !update ) {
            setError( new Error( 'refreshPosts: yielded no new updates' ) )
            return
        }
        setPosts( update )
    }

    // function called when new list requests are made to update the display
    const refreshPosts = () => {
        onRefresh(location, updatePosts)
    }

    // initializes the list to populate based on the default app location
    useEffect( () => {
        onRefresh()
    }, [] )
    
    // defines the props for the Posts SectionList (the view for the screen)
    const props = {
        data: posts,
        onRefresh: refreshPosts,
        setKeyword, setLocation,
        search: refreshPosts,
        tagList,
        sortList,
        style,
        setSort,
        setTags,
        refreshing,
    }
    
    // re-render/ control filtering and sorting 
    useEffect( () => {
        // do filtering sorting and updating lists here
        setLoading(true)
        console.log( '\nSorting by: ' + sort + '\n' )
        console.log( '\nTags list is : [' + tags + ']\n' )
        setLoading(false)
    }, [ sort, setSort, tags, setTags ] )
    
    // re-render/ control loading behavior
    useEffect( () => {
        // do loading behavior stuff here
    }, [ refreshing ] )
    
    // re-render/ control error or helper messages
    useEffect( () => {
        // do error handling stuff here
        console.log(error)
    }, [error, setError])

    // Render the Post Listing Screen component
    return (
        <View>
            <PostsSectionList ListHeaderComponent={() => <PostsListHeaderComponent {...props} />} {...props} />
        </View>
    )
}
