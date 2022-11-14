import React, { useEffect, useState } from 'react'
import { FilterOptionsScroller } from './FilterOptionsScroller'




export const FilterBar = ( {tagList, sortList, style, callback } ) => {
  const [ sort, setSort ] = useState( '' )
  const [ tag, setTag ] = useState( '' )
  const [ tags, setTags ] = useState( [] )
  const [ filters, setFilters ] = useState( { sortOptions: [], tagOptions: [] } )
  
  
  useEffect( () => {
    if ( !sortList | !tagList ) return
    let sortOptions = sortList.map( item => { return ( { label: 'Sort By: ' + item } ) } )
    let tagOptions = tagList.map( item => { return ( { label: item } ) } )
    setFilters({
      sortOptions: sortOptions,
      tagOptions: tagOptions
    })
  }, [ tagList, sortList ] )
  

  useEffect( () => {
    if ( !tag ) return
    let temp = tags.filter( item => item !== tag )
    if ( temp.length === tags.length ) {
      temp = [...temp, tag]
    }
    setTags( temp )
  }, [tag, setTag])

  useEffect( () => {
    callback({sort: sort, tags: tags})
  }, [sort, setSort, tags, setTags])

  return (
    <>
        <FilterOptionsScroller filters={filters} setSort={setSort} setTag={setTag} style={style} />
    </>
  )
}