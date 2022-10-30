import React from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker'

const TimeInput = ({ value, onChange }) => {
    return (
        <RNDateTimePicker
            mode="time"
            display="spinner"
            onChange={onChange}
            value={value}
        />
    )
}

export default TimeInput; 
