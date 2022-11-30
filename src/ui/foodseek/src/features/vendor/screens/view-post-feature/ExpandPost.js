import React, { useContext, useEffect, useState } from "react"
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { ExpandedView } from './ExpandedView'

export const ExpandPost = ( props ) => {
    const { loading, setLoading, onUpdate } = useContext( FoodCardContext )
    const { phoneNumber, vendor } = props.route.params
    const backgroundColor = '#fff'
    const [ complete, setComplete ] = useState( false )
    useEffect( () => {
        if ( !complete ) return
        props.navigation.navigate('PostHistory', {refresh: true})
    }, [complete, setComplete])

    return (
        <ExpandedView {...{...props, ...props.route.params, vendor: vendor.name, phone: phoneNumber, setComplete, loading, setLoading, onUpdate, backgroundColor}} />

    )
}

