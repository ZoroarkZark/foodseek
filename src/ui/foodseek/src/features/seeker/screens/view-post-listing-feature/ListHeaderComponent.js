import { View } from 'react-native'
import { AutocompleteSearchBar } from '../../../../components/api/AutocompleteSearchBar'
import { FilterBar } from './FilterBar'


// provides the search bar and filter buttons scroll to be rendered above the post cards
export const ListHeaderComponent = ( { setSearchKey, setKeyCoordinates, refreshPosts, tagList, sortList, style, setSort, setTags } ) => (
    <>
        <View
            style={{ paddingTop: 60, padding: 10, paddingBottom: 65, ...style }}
        >
            <AutocompleteSearchBar
                setKeyword={setSearchKey}
                setLocation={setKeyCoordinates}
                search={refreshPosts}
            />
            <FilterBar
                tagList={tagList}
                sortList={sortList}
                style={style}
                callback={({ sort, tags }) => {
                    setSort(sort)
                    setTags(tags)
                }}
            />
        </View>
    </>
)
