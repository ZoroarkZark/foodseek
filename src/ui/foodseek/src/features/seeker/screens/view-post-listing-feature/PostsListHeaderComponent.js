import React from 'react'
import { View } from 'react-native'
import { AutocompleteSearchBar } from '../../../../components/api/AutocompleteSearchBar'
import { FilterBar } from './FilterBar'


// provides the search bar and filter buttons scroll to be rendered above the post cards
export const PostsListHeaderComponent = props => {
    const { setKeyword, setLocation, search, tagList, sortList, style, setSort, setTags } = props
    return (
        <>
        <View
            style={{ paddingTop: 60, padding: 10, paddingBottom: 65, ...style }}
        >
            <AutocompleteSearchBar
                setKeyword={setKeyword}
                setLocation={setLocation}
                search={search}
            />
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
    )
}
