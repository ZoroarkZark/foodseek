import React, {useState} from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import { TimeInput } from "../components/common";
import { TimeRange } from "../components/forms";

export const HoursOfOperationScreen = ({navigation}) => {
    const [mondayTime, setMondayTime] = useState(new Date());
    const [tuesdayTime, settuesdayTime] = useState(new Date());
    const [weddayTime, setweddayTime] = useState(new Date());
    const [thursdayTime, setthursdayTime] = useState(new Date());
    const [fridayTime, setfridayTime] = useState(new Date());
    const [saturdayTime, setsaturdayTime] = useState(new Date());
    const [sundayTime, setsundayTime] = useState(new Date());
    const [show, setShow] = useState(true);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setMondayTime(currentDate);
    }

    return (
        <View>
            <Text>Monday</Text>
            <TimeInput value={mondayTime} onChange ={onChange}/>
            <Text>{mondayTime.toLocaleTimeString('en-US', {timeStyle: 'short'})}</Text>
            
            {/*<Text>Tuesday</Text>
            <TimeInput value={new Date()} onChange ={new Date()}/>
            <Text>Wednesday</Text>
            <TimeInput value={new Date()} onChange ={new Date()}/>
            <Text>Thursday</Text>
            <TimeInput value={new Date()} onChange ={new Date()}/>
            <Text>Friday</Text>
            <TimeInput value={new Date()} onChange ={new Date()}/>
            <Text>Saturday</Text>
            <TimeInput value={new Date()} onChange ={new Date()}/>
            <Text>Sunday</Text>
    <TimeInput value={new Date()} onChange ={new Date()}/>*/}

        </View>
    );
};

/* 






Row with Dates
Able to Select Day, Hours, Minutes, etc.
AM/PM
Add New Row Button 
Done Button 

*/

