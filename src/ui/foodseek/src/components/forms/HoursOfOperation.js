
import React from "react";
import { View, Text} from "react-native";
import { TimeInput } from "../common";


const week = {
    monday : {
        value: {
            start: new Date(),
            end: new Date()
        },
        onChange: {
            start: new Date(),
            end: new Date()
        },
    },
    tuesday : {
        value: {
            start: new Date(),
            end: new Date()
        },
        onChange: {
            start: new Date(),
            end: new Date()
        },
    },
    wednesday : {
        value: {
            start: new Date(),
            end: new Date()
        },
        onChange: {
            start: new Date(),
            end: new Date()
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



export const TimeRange = ({type="label", labelStart="Start", labelEnd="End", value, onChange}) => {
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


    




