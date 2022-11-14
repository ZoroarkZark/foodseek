import React, { useContext, useEffect, useRef } from 'react'
import { DATA } from '../../../../components/post/TestData' // import some local dummy data for demo purposes
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets} from 'react-native-safe-area-context'
import { PostsSection } from './PostsSection'
import { SearchFilterBar } from './SearchFilterBar'
import { AutocompleteSearchBar } from '../../../../components/api/GooglePlacesInput'




// Returns a PostList to display a list of available vendor posts to the user
export const Posts = ({ navigation }) => {
    const { cards, test, onRefresh, loading } = useContext( FoodCardContext )
    const placesRef = useRef()
    const sortList = [ 'Nearest', 'Newest', 'Oldest' ]
    //const tagList = cards.map( ( { cuisine } ) => ( [ ...tagList, cuisine ] ) )
    const tagList = ['Chinese', 'Thai', 'Mexican']
    const style = useSafeAreaInsets()


    // TODO sql server keeps going down but we need to operate on cards so this just sets the default cards before anything
    useEffect(() => {
        test(DATA)
    }, [] )
    
    useEffect( () => {
        
    }, [cards, loading, onRefresh])

    return (
        <><View>
            <PostsSection
                DATA={cards ? cards : DATA}
                ListHeaderComponent={<View style={{alignContent: 'center'}}>
                    
                    <AutocompleteSearchBar placesRef={placesRef} style={{backgroundColor: '#fff', width: useWindowDimensions().width-20, paddingTop: 60, padding: 10, paddingBottom: 65,  ...style}} />

                        <SearchFilterBar
                        ref={placesRef}
                        tagList={tagList}
                        sortList={sortList}
                        style={style} 
                        callback={({sort, tags}) => console.log('Sorting by: '+JSON.stringify(sort)+'\nTag(s): '+JSON.stringify(tags))}
                        />

                            

</View>

                }
                refreshing={loading}
                onRefresh={() => onRefresh()} 
                
                />
            </View>
    </>
    )
}
