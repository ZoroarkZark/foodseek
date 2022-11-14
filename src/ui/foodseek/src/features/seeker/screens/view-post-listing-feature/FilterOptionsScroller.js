import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ToggleButton as TB } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

// button component that defines the filter buttons
export const ToggleButton = ( { label, callback } ) => {
    const [status, setStatus] = React.useState('unchecked')

    const onButtonToggle = (value) => {
        setStatus( status === 'checked' ? 'unchecked' : 'checked' )
        callback(label)
    }

    return (
        <TB
            icon={() => (
                <View>
                    <Text
                        style={{
                            borderTopLeftRadius: 9,
                            borderTopRightRadius: 9,
                            borderBottomLeftRadius: 9,
                            borderBottomRightRadius: 9,
                            height: 18,
                            color: 'grey',
                        }}
                    >
                        {label}
                    </Text>
                </View>
            )}
            style={{
                borderWidth: 0.5,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                width: label.length * 12,
                height: 23,
                marginRight: 4,
            }}
            value={label}
            status={status}
            onPress={onButtonToggle}
        >
            <Text>{label}</Text>
        </TB>
    )
}


    

// horizontal list of filter buttons
    export const FilterOptionsScroller = ( {filters, setSort, setTag, style} ) => {
        const { sortOptions, tagOptions } = filters
        const [ sortChoice, setSortChoice ] = useState( '' )
        const [ tagChoice, setTagChoice ] = useState( '' )

        useEffect( () => {
            if ( !sortChoice ) return
            setSort(sortChoice)
        }, [ sortChoice, setSortChoice ] )
        
        useEffect( () => {
            if ( !tagChoice ) return
            setTag(tagChoice)
        }, [ tagChoice, setTagChoice ] )
        
        
        
        const SortFilters = ( { options, value, setValue, style} ) => {
            return (
                <View>
                <TB.Group
                    onValueChange={value => setValue( value )}
                    value={value}>
                    {options.map( ( option ) => {
                        return (
                            <View
                                style={style} >
                                <ToggleButton
                                    label={option.label}
                                    callback={setValue} />
                            </View>
                        )})}
                    </TB.Group>
                </View>
            )
        }
        return (
            <ScrollView
            flex={1}
            horizontal={true}
            keyboardShouldPersistTaps={'handled'}
            paddingTop={6}
            contentInset={{ top: 0, left: 10, bottom: 0, right: 10 }}
                showsHorizontalScrollIndicator={false} >
                {/* <SortFilters options={sortOptions} value={sortChoice} setValue={setSortChoice} style={style} /> */}
                {tagOptions.map((filter) => {
                  return (
                        <ToggleButton
                          label={filter.label}
                          callback={setTagChoice}
                        />
                    )
              })}
            </ScrollView>
        
    )
}
    


