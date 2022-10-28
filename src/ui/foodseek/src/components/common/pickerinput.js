import React from 'react'
import { Picker } from 'react-native-rapi-ui'

const PickerInput = ({
    children,
    value,
    style,
    onValueChange,
    placeholder,
    label = 'Picker',
    options = [
        { label: 'Seeker', value: 'USR_SEEK' },
        { label: 'Vendor', value: 'USR_VEND' },
    ],
}) => {
    return (
        <Picker
            items={options}
            value={value}
            style={style}
            placeholder={children ? children : placeholder}
            onValueChange={onValueChange}
        ></Picker>
    )
}

export const TransitPickerInput = ({
    children,
    value,
    style,
    onValueChange,
    placeholder,
    label = 'Picker',
    options = [
        { label: 'Walking', value: 'walking' },
        { label: 'Bicycle', value: 'bicycle' },
        { label: 'Driving', value: 'vehicle' },
        { label: 'Public Transit', value: 'public' },
    ],
}) => {
    return (
        <Picker
            items={options}
            value={value}
            style={style}
            placeholder={children ? children : placeholder}
            onValueChange={onValueChange}
        ></Picker>
    )
}

export default PickerInput
