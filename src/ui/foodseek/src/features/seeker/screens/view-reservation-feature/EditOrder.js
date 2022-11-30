import React, { useContext, useEffect, useState } from "react"
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { ExpandedView as EditOrderView } from './utils'

export const EditOrder = ( props ) => {
  const { loading, setLoading, onCancel } = useContext( FoodCardContext )
  const {card} = props
  const { phoneNumber, vendor } = props.route.params
  const backgroundColor = '#fff'
  const [ complete, setComplete ] = useState( false )
    useEffect( () => {
      if ( !complete ) return
        onCancel({card})
        props.navigation.navigate('OrderList', {refresh: true})
    }, [complete, setComplete])

    //Ideally, want to have data from postCard read in, and data then referenced from info in postCard, and looked up for the 
    return (
        <EditOrderView {...{...props, ...props.route.params, actionName: 'cancel', vendor: vendor.name, phone: phoneNumber, setComplete, loading, setLoading, backgroundColor}} />

    )
}


// <SectionImage source= {require('../../../../../assets/icons/fast-food-outline.png')} height ={200}/>