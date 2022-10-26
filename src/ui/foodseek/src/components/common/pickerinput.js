import React from "react";
import { Picker } from "react-native-rapi-ui";


const PickerInput = ({children, value, style, onValueChange, placeholder, label="Picker", options=[
    {label: 'Seeker', value: 'USR_SEEK'},
    {label: 'Vendor', value: 'USR_VEND'}
]}) => {


    return (

    <Picker
        items={options}
        value={value}
        style={style}
        placeholder={children ? children : placeholder}
        onValueChange={onValueChange}>
    </Picker>


    )
}


export const TransitPickerInput = ({children, value, style, onValueChange, placeholder, label="Picker", options=[
    {label: 'Walking', value: 'walking'},
    {label: 'Bicycle', value: 'bicycle'},
    {label: 'Driving', value: 'vehicle'},
    {label: 'Public Transit', value: 'public'},
]}) => {


    return (

    <Picker
        items={options}
        value={value}
        style={style}
        placeholder={children ? children : placeholder}
        onValueChange={onValueChange}>
    </Picker>


    )
}

export const DayPickerInput = ({children, value, style, onValueChange, placeholder, label="Picker", options=[
    {label: 'Monday', value: 'monday'},
    {label: 'Tuesday', value: 'tuesday'},
    {label: 'Wednesday', value: 'wednesday'},
    {label: 'Thursday', value: 'thursday'},
    {label: 'Friday', value: 'friday'},
    {label: 'Saturday', value: 'saturday'},
    {label: 'Sunday', value: 'sunday'},
]}) => {


    return (

    <Picker
        items={options}
        value={value}
        style={style}
        placeholder={children ? children : placeholder}
        onValueChange={onValueChange}>
    </Picker>


    )
}

export default PickerInput;