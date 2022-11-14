import React, { useContext, useEffect, useState } from 'react'
import { DATA } from '../../../../components/post/TestData' // import some local dummy data for demo purposes
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { View } from 'react-native'
import { useSafeAreaInsets} from 'react-native-safe-area-context'
import { PostsSection } from './PostsSection'
import { FilterBar } from './FilterBar'
import { AutocompleteSearchBar } from '../../../../components/api/AutocompleteSearchBar'
import { LocationContext } from '../../../../context/LocationContext'


const DEFAULT_CARD_ARRAY = DATA ? DATA : []

// Returns a PostList to display a list of available vendor posts to the user
export const Posts = ( { navigation } ) => {
    // error and data storage for the post screen component
    const [ error, setError ] = useState( null )
    const [ posts, setPosts ] = useState( DEFAULT_CARD_ARRAY )
    const [ sort, setSort ] = useState( null )
    const [ tags, setTags ] = useState( null )
    

    // context classes for location and food card providers
    const {location, keyword } = useContext(LocationContext)
    const { onRefresh, loading, cardsLoading } = useContext( FoodCardContext )

    // search term and coordinates
    const [ searchKey, setSearchKey ] = useState( keyword )
    const [ keyCoordinates, setKeyCoordinates ] = useState( location )


    const sortList = [ 'Nearest', 'Newest', 'Oldest' ]
    const tagList = ['Chinese', 'Thai', 'Mexican']
    const style = useSafeAreaInsets()
    

    // function updates the list of post cards if one is available
    const updatePosts = ( update ) => {
        if ( !update ) {
            setError( new Error( 'refreshPosts: yielded no new updates' ) )
            return
        }
        setPosts( update )
    }

    // function called on refresh
    const refreshPosts = () => {
        onRefresh(keyCoordinates, updatePosts)
    }

    // calls to request data to initialize list
    useEffect( () => {
        onRefresh()
    }, [])
    
    useEffect( () => {
        // do filtering sorting and updating lists here
        cardsLoading(true)
        console.log( '\nSorting by: ' + sort + '\n' )
        console.log( '\nTags list is : [' + tags + ']\n' )
        cardsLoading(false)
    }, [ sort, setSort, tags, setTags ] )
    

    useEffect( () => {
        // do loading behavior stuff here
    }, [ loading ] )
    

    useEffect( () => {
        // do error handling stuff here
        console.log(error)
    }, [error, setError])

    return (
        <><View>
            <PostsSection
                DATA={posts}
                ListHeaderComponent={<>
                    <View style={{paddingTop: 60, padding: 10, paddingBottom: 65,  ...style}}>
                        <AutocompleteSearchBar setKeyword={setSearchKey} setLocation={setKeyCoordinates} search={refreshPosts} />
                        <FilterBar
                        tagList={tagList}
                        sortList={sortList}
                        style={style} 
                            callback={( { sort, tags } ) => {
                                setSort( sort )
                                setTags( tags )
                        }}
                        />
                    </View>
                    </>
                }
                refreshing={loading}
                onRefresh={() => refreshPosts()} 
                />
            </View>
    </>
    )
}
