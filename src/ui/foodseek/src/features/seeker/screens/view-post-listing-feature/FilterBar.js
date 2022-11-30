import React, { useEffect, useState } from 'react'
import { FilterOptionsScroller } from './FilterOptionsScroller'

export const FilterBar = props => {
  const {tagList, sortList, style, callback } = props
  const [ sort, setSort ] = useState( '' )
  const [ tag, setTag ] = useState( '' )
  const [ tags, setTags ] = useState( [] )
  const [ filters, setFilters ] = useState( { sortOptions: [], tagOptions: [] } )
  
  useEffect( () => {
    if ( !sortList | !tagList ) return
    let sortOptions = sortList.map( item => { return ( { label: item } ) } )
    let tagOptions = tagList.map( item => { return ( { label: item } ) } )
    setFilters({
      sortOptions: sortOptions,
      tagOptions: tagOptions
    })
  }, [ tagList, sortList ] )
  

  useEffect( () => {
    if ( !tag ) return
    let { status, value } = tag
    if ( status === false ) {
      setTags(tags.filter((t) => t !== value))
    } else {
      setTags([value, ...tags])
    }
  }, [tag, setTag])

  useEffect( () => {
    callback({sort: sort, tags: tags})
  }, [tag, setTag, sort, setSort, tags, setTags])

  return (
    <>
        <FilterOptionsScroller {...{filters, setSort, setTag, style}} />
    </>
  )
}