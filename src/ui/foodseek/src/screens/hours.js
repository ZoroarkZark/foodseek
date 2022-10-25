import React, {useState} from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import { TimeInput } from "../components/common";
import { TimeRange } from "../components/forms";

export const HoursOfOperationScreen = ({navigation}) => {
    const [mondayTime, setMondayTime] = useState(new Date());
    const [monText, setmonText] = useState('');
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
        let monTexter = mondayTime.getHours() + ":"
        if (mondayTime.getUTCMinutes() < 10){
            monTexter = monTexter + "0";
        }
        monTexter = monTexter + mondayTime.getUTCMinutes();
        setmonText(monTexter);
        setShow(false);
    }

    return (
        <View>
            <Button title ={"Monday"}/>
            <TimeInput value={mondayTime} onChange ={onChange}/>
            <Text>{monText}</Text>

            
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

