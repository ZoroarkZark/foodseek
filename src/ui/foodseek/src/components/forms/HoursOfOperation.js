
import React from 'react'
import { View, Text} from 'react-native'
import { TimeInput } from '../common'

// this is just a sample of a data structure, delete when necessary
// const week = {
//     monday : {
//         value: {
//             start: ,
//             end: ,
//         },
//         onChange: {
//             start: ,
//             end: ,
//         },
//     }
//     tuesday : {
//         value: {
//             start: ,
//             end: ,
//         },
//         onChange: {
//             start: ,
//             end: ,
//         },
//     }
//     wednesday : {
//         value: {
//             start: ,
//             end: ,
//         },
//         onChange: {
//             start: ,
//             end: ,
//         },
//     }
//     thursday : {
//         value: {
//             start: ,
//             end: ,
//         },
//         onChange: {
//             start: ,
//             end: ,
//         },
//     }
//     friday : {
//         value: {
//             start: ,
//             end: ,
//         },
//         onChange: {
//             start: ,
//             end: ,
//         },
//     }
//     saturday : {
//         value: {
//             start: ,
//             end: ,
//         },
//         onChange: {
//             start: ,
//             end: ,
//         },
//     }
//     sunday : {
//         value: {
//             start: ,
//             end: ,
//         },
//         onChange: {
//             start: ,
//             end: ,
//         },
//     }
// }



const TimeRange = ({type='label', labelStart='Start', labelEnd='End', value, onChange}) => {
    if (type === 'label') {
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
    if (type === 'to') {
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


    



