import React, {useState} from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import { DayPickerInput } from "../components/common/pickerinput";
import { TimeInput } from "../components/common";
import { TimeRange } from "../components/forms";

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
            start: new Date(),
            end: new Date()
        },
        onChange: {
            start: new Date(),
            end: new Date()
        },
    },
    friday : {
        value: {
            start: new Date(),
            end: new Date()
        },
        onChange: {
            start: new Date(),
            end: new Date()
        },
    },
    saturday : {
        value: {
            start: new Date(),
            end: new Date()
        },
        onChange: {
            start: new Date(),
            end: new Date()
        },
    },
    sunday : {
        value: {
            start: new Date(),
            end: new Date()
        },
        onChange: {
            start: new Date(),
            end: new Date()
        },
    }
}

export const HoursOfOperationScreen = ({navigation}, props) => {
    const [mondayTime, setMondayTime] = useState(new Date());
    const [day, setDay] = useState("monday");
    const [tuesdayTime, setTuesdayTime] = useState(new Date());
    const [weddayTime, setWeddayTime] = useState(new Date());
    const [thursdayTime, setThursdayTime] = useState(new Date());
    const [fridayTime, setFridayTime] = useState(new Date());
    const [saturdayTime, setSaturdayTime] = useState(new Date());
    const [sundayTime, setSundayTime] = useState(new Date());
    const [show, setShow] = useState(false);

    const onMonChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setMondayTime(currentDate);
    }
    const onTueChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setTuesdayTime(currentDate);
    }
    const onWedChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setWeddayTime(currentDate);
    }
    const onThuChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setThursdayTime(currentDate);
    }
    const onFriChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setFridayTime(currentDate);
    }
    const onSatChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setSaturdayTime(currentDate);
    }
    const onSunChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setSundayTime(currentDate);
    }

    const onDayChange = (event, selectedDay) => {
        const currentDay = selectedDay;
        setDay(currentDay);
    }

    const renderSwitch = (day) => {
        switch(day){
            case 'monday':
                return <View>
                <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                <Text>{day}</Text>
                <Button title ={"Monday"}/>
                <TimeInput value={mondayTime} onChange ={onMonChange}/>
                <Text>{mondayTime.toLocaleTimeString()}</Text>
                </View>
            case 'tuesday':
                return <View>
                <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                <Text>{day}</Text>
                <Button title ={day}/>
                <TimeInput value={tuesdayTime} onChange ={onTueChange}/>
                <Text>{tuesdayTime.toLocaleTimeString()}</Text>
                </View>
            case 'wednesday':
                return <View>
                <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                <Text>{day}</Text>
                <Button title ={day}/>
                <TimeInput value={weddayTime} onChange ={onWedChange}/>
                <Text>{weddayTime.toLocaleTimeString()}</Text>
                </View>
            case 'thursday':
                return <View>
                <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                <Text>{day}</Text>
                <Button title ={day}/>
                <TimeInput value={thursdayTime} onChange ={onThuChange}/>
                <Text>{thursdayTime.toLocaleTimeString()}</Text>
                </View>
            case 'friday':
                return <View>
                <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                <Text>{day}</Text>
                <Button title ={day}/>
                <TimeInput value={fridayTime} onChange ={onFriChange}/>
                <Text>{fridayTime.toLocaleTimeString()}</Text>
                </View>
            case 'saturday':
                return <View>
                <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                <Text>{day}</Text>
                <Button title ={day}/>
                <TimeInput value={saturdayTime} onChange ={onSatChange}/>
                <Text>{saturdayTime.toLocaleTimeString()}</Text>
                </View>
            case 'sunday':
                return <View>
                <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                <Text>{day}</Text>
                <Button title ={day}/>
                <TimeInput value={sundayTime} onChange ={onSunChange}/>
                <Text>{sundayTime.toLocaleTimeString()}</Text>
                </View>
        }
    }

    return (
    <View>
        {renderSwitch(day)}
        
            {/*<DayPickerInput value={props.day} onValueChange={props.setDay}>DAY</DayPickerInput>
            <Text>{props.day}</Text>
            <Button title ={"Monday"}/>
            <TimeInput value={mondayTime} onChange ={onChange}/>
    <Text>{mondayTime.toLocaleTimeString()}</Text>*/}

            
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

