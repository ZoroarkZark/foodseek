
import React from "react";
import { View, Text} from "react-native";
import { TimeInput } from "../common";


const week = {
    monday : {
        value: {
            start: '',
            end: ''
        },
        onChange: {
            start: '',
            end: ''
        },
    },
    tuesday : {
        value: {
            start: '',
            end: ''
        },
        onChange: {
            start: '',
            end: ''
        },
    },
    wednesday : {
        value: {
            start: '',
            end: ''
        },
        onChange: {
            start: '',
            end: ''
        },
    },
    thursday : {
        value: {
            start: '',
            end: ''
        },
        onChange: {
            start: '',
            end: ''
        },
    },
    friday : {
        value: {
            start: '',
            end: ''
        },
        onChange: {
            start: '',
            end: ''
        },
    },
    saturday : {
        value: {
            start: '',
            end: ''
        },
        onChange: {
            start: '',
            end: ''
        },
    },
    sunday : {
        value: {
            start: '',
            end: ''
        },
        onChange: {
            start: '',
            end: ''
        },
    }
}



const TimeRange = ({type="label", labelStart="Start", labelEnd="End", value, onChange}) => {
    if (type === "label") {
        return (
            <>
            <View style={{flex: 1}}>
            <Text>{labelStart}</Text>
            <TimeInput value={value.start} onChange={onChange.start} />
            </View>
            <View style={{flex: 1}}>
            <Text>{labelEnd}</Text>
            <TimeInput value={value.end} onChange={onChange.end} />
            </View>
            </>
        )
    }
    if (type === "to") {
        return (
            <>
            <View style={{flex: 4}}>
            <TimeInput value={value.start} onChange={onChange.start} />
            </View>
            <View style={{flex: 1}}>
                <Text>to</Text>
            </View>
            <View style={{flex: 4}}>
            <TimeInput value={value.end} onChange={onChange.end} />
            </View>
            </>
        )
    }
}


    



export const HoursOfOperation = ({type="to", start: labelStart="Start", end: labelEnd="End", value, onChange}) => {
    return (
        <View>
                <Text>Monday (leave blank if closed)</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TimeRange type={type} value={{start: value.monday.start, end: value.monday.end}} onChange={{start: onChange.monday.start, end: onChange.monday.end}} />
                </View>
                <Text>Tuesday (leave blank if closed)</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TimeRange type={type} value={{start: value.tuesday.start, end: value.tuesday.end}} onChange={{start: onChange.tuesday.start, end: onChange.tuesday.end}} />
                </View>
                <Text>Wednesday (leave blank if closed)</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TimeRange type={type} value={{start: value.wednesday.start, end: value.wednesday.end}} onChange={{start: onChange.wednesday.start, end: onChange.wednesday.end}} />
                </View>
                <Text>Thursday (leave blank if closed)</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TimeRange type={type} value={{start: value.thursday.start, end: value.thursday.end}} onChange={{start: onChange.thursday.start, end: onChange.thursday.end}} />
                </View>
                <Text>Friday (leave blank if closed)</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TimeRange type={type} value={{start: value.friday.start, end: value.friday.end}} onChange={{start: onChange.friday.start, end: onChange.friday.end}} />
                </View>
                <Text>Saturday (leave blank if closed)</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TimeRange type={type} value={{start: value.saturday.start, end: value.saturday.end}} onChange={{start: onChange.saturday.start, end: onChange.saturday.end}} />
                </View>
                <Text>Sunday (leave blank if closed)</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TimeRange type={type} value={{start: value.sunday.start, end: value.sunday.end}} onChange={{start: onChange.sunday.start, end: onChange.sunday.end}} />
                </View>
        </View>

    );
}
