// TODO: remove this dummy data and move to config or testing
import { DATA } from '../../../../components/post/TestData' 
import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native'

// globals: imports provide the food card services and location services
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { LocationContext } from '../../../../context/LocationContext'

// rendering: imports provide the viewable components to render
import { PostsSectionList } from './PostsSectionList'
import { AutocompleteSearchBar } from '../../../../components/api/AutocompleteSearchBar'
import { FilterBar } from './FilterBar'
import { SearchInput } from '../../../../components/common'

// Provides Odin
import { Odin } from '../../../../components/common/Odin'
import { Button } from 'react-native-rapi-ui'

// TODO: move to config for testing


// Returns a PostList to display a list of available vendor posts to the user
export const Posts = ( { navigation } ) => {
    // context classes for location and food card providers
    const { location: loc, keyword: key } = useContext( LocationContext )
    const { onRefresh, loading: refreshing, setLoading, onReserve, orders, cards } = useContext( FoodCardContext )
    
    // error and data storage for the post screen component
    const [ error, setError ] = useState( null )
    const [ posts, setPosts ] = useState( cards )
    const [ sort, setSort ] = useState( null )
    const [ tags, setTags ] = useState( null )
    const [ fresh, setFresh ] = useState( true )

    // search term and coordinates
    const [ keyword, setKeyword ] = useState( key )
    const [ location, setLocation ] = useState( loc )
    const [ searchTerm, setSearchTerm ] = useState ( '' )

    // TODO:
    const [ sortList, setSortList ] = useState( [ 'Nearest', 'Newest', 'Oldest' ] )
    const [ tagList, setTagList ] = useState( [ 'Chinese', 'Thai', 'Mexican' ] )
    
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
        onRefresh({coords : location, setResult : updatePosts})

    }

    // filters out the cards that are shown based on the current text field
    function filterPosts ( array, searchTerm ) {
        const newArray = array.filter((element) => {
            if (!element.tags) return false
            return element.tags.includes(searchTerm)
        });
        return newArray;
    } 

    useEffect( () => {
        //console.log(orders)
    }, [onReserve] )

    // initializes the list to populate based on the default app location
    useEffect( () => {
        onRefresh()
    }, [] )

    useEffect( () => {
        if ( posts ) return
        let limit = 10
        let retry
        while ( !posts ) {
            refreshPosts()
            retry += 1
        }
        if ( !posts ) {
            setError( new Error( `Loading post list failed after ${ limit } retries` ) )
            return
        }
        console.log( posts )
    }, [])
    
    
    // re-render/ control filtering and sorting 
    useEffect( () => {
        // do filtering sorting and updating lists here
        setLoading(true)
        setLoading(false)
    }, [ sort, setSort, tags, setTags ] )
    
    // re-render/ control loading behavior
    useEffect( () => {
        // do loading behavior stuff here
        if (fresh === true){
            refreshPosts()
            setFresh(false)
        }
    }, [ refreshing ] )
    
    // re-render/ control error or helper messages
    useEffect( () => {
        // do error handling stuff here
        if (!error) return
    }, [ error, setError ] )

    // defines the props for the Posts SectionList (the view for the screen)
    let props = {
        data: posts,
        onRefresh: refreshPosts,
        setKeyword,
        setLocation,
        tagList,
        sortList,
        style,
        setSort,
        setTags,
        refreshing,
    }

    // Render the Post Listing Screen component
    return (
        <View>
            <PostsSectionList
                {...{ ...props }}
                ListHeaderComponent={
                    <>
                        <View
                            style={{ paddingTop: 110, padding: 10, paddingBottom: 10, ...style }}
                        >
                            <AutocompleteSearchBar
                                {...
                                {
                                    setKeyword,
                                    setLocation,
                                    search: refreshPosts,
                                }
                                }
                            />
                            <SearchInput
                                value={searchTerm}
                                onChangeText={(text) => setSearchTerm(text)}
                                onSubmitEditing={() => {{
                                    if (searchTerm != '') 
                                    { 
                                        var newCards = filterPosts(posts, searchTerm);
                                        if (newCards === undefined || newCards.length == 0){
                                            alert("Sorry! Couldn't find any results! Reloading list.")
                                            refreshPosts(); 
                                        }
                                        else {
                                            updatePosts(newCards);
                                        }

                                    } 
                                    else
                                    {
                                        refreshPosts();
                                    }
                                }}}
                            >
                                 Search...
                            </SearchInput>
                            <FilterBar
                                {...
                                {
                                    tagList,
                                    sortList,
                                    style,
                                    callback: 
                                        ( { sort, tags } ) => {
                                            setSort( sort )
                                            setTags( tags )
                                        },
                                }
                                }
                            />
                        </View>
                    </>
                }
                 />
        </View>
    )
}
