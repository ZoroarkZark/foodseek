import React from "react";
import RNDateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const TimeInput = ({value, onChange}) => {
    return <RNDateTimePicker mode="time" display="spinner" onChange={onChange} value={value} />
}

export default TimeInput; 