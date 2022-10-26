import React, {useState} from "react";
import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity } from 'react-native';
import { DayPickerInput } from "../components/common/pickerinput";
import { TimeInput } from "../components/common";
import { TimeRange } from "../components/forms";
import styles2, { styles } from "../components/styleSheet";

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
    const [day, setDay] = useState("monday");

    //START TIMES
    const [mondayTime, setMondayTime] = useState(new Date());
    const [tuesdayTime, setTuesdayTime] = useState(new Date());
    const [weddayTime, setWeddayTime] = useState(new Date());
    const [thursdayTime, setThursdayTime] = useState(new Date());
    const [fridayTime, setFridayTime] = useState(new Date());
    const [saturdayTime, setSaturdayTime] = useState(new Date());
    const [sundayTime, setSundayTime] = useState(new Date());

    //END TIMES
    const [mondayEndTime, setMondayEndTime] = useState(new Date());
    const [tuesdayEndTime, setTuesdayEndTime] = useState(new Date());
    const [weddayEndTime, setWeddayEndTime] = useState(new Date());
    const [thursdayEndTime, setThursdayEndTime] = useState(new Date());
    const [fridayEndTime, setFridayEndTime] = useState(new Date());
    const [saturdayEndTime, setSaturdayEndTime] = useState(new Date());
    const [sundayEndTime, setSundayEndTime] = useState(new Date());

    //START SHOWING
    const [mondayShow, setMondayShow] = useState(false);
    const [tuesdayShow, setTuesdayShow] = useState(false);
    const [wednesdayShow, setWednesdayShow] = useState(false);
    const [thursdayShow, setThursdayShow] = useState(false);
    const [fridayShow, setFridayShow] = useState(false);
    const [saturdayShow, setSaturdayShow] = useState(false);
    const [sundayShow, setSundayShow] = useState(false);

    //END SHOWING
    const [mondayEndShow, setMondayEndShow] = useState(false);
    const [tuesdayEndShow, setTuesdayEndShow] = useState(false);
    const [wednesdayEndShow, setWednesdayEndShow] = useState(false);
    const [thursdayEndShow, setThursdayEndShow] = useState(false);
    const [fridayEndShow, setFridayEndShow] = useState(false);
    const [saturdayEndShow, setSaturdayEndShow] = useState(false);
    const [sundayEndShow, setSundayEndShow] = useState(false);

    const onMonChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setMondayTime(currentDate);
        setMondayShow(false);
    }
    const onMonEndChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setMondayEndTime(currentDate);
        setMondayEndShow(false);
    }
    const onTueChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setTuesdayTime(currentDate);
        setTuesdayShow(false);
    }
    const onTueEndChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setTuesdayEndTime(currentDate);
        setTuesdayEndShow(false);
    }
    const onWedChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setWeddayTime(currentDate);
        setWednesdayShow(false);
    }
    const onWedEndChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setWeddayEndTime(currentDate);
        setWednesdayEndShow(false);
    }
    const onThuChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setThursdayTime(currentDate);
        setThursdayShow(false);
    }
    const onThuEndChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setThursdayEndTime(currentDate);
        setThursdayEndShow(false);
    }
    const onFriChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setFridayTime(currentDate);
        setFridayShow(false);
    }
    const onFriEndChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setFridayEndTime(currentDate);
        setFridayEndShow(false);
    }

    const onSatChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setSaturdayTime(currentDate);
        setSaturdayShow(false);
    }
    const onSatEndChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setSaturdayEndTime(currentDate);
        setSaturdayEndShow(false);
    }

    const onSunChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setSundayTime(currentDate);
        setSundayShow(false);
    }
    const onSunEndChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setSundayEndTime(currentDate);
        setSundayEndShow(false);
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
                    <TouchableOpacity style={styles2.buttonStyle} onPress ={() => setMondayShow(true)}><Text style={styles2.buttonTextStyle}>Set Start Time</Text></TouchableOpacity>
                    <Text style={styles2.buttonTextStyle}>Start Time: {mondayTime.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit"})}</Text>
                    <TouchableOpacity style={styles2.buttonStyle} onPress ={() => setMondayEndShow(true)}><Text style={styles2.buttonTextStyle}>Set End Time</Text></TouchableOpacity>
                    <Text style={styles2.buttonTextStyle}>End Time: {mondayEndTime.toLocaleTimeString()}</Text>
                {
                mondayShow && 
                <TimeInput value={mondayTime} onChange ={onMonChange}/>
                }
                {
                mondayEndShow &&
                <TimeInput value={mondayEndTime} onChange ={onMonEndChange}/>
                }       
                </View>
            case 'tuesday':
                return <View>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <TouchableOpacity style={styles2.buttonStyle} onPress ={() => setTuesdayShow(true)}><Text style={styles2.buttonTextStyle}>Set Start Time</Text></TouchableOpacity>
                    <Text style={styles2.buttonTextStyle}>Start Time: {tuesdayTime.toLocaleTimeString()}</Text>
                    <TouchableOpacity style={styles2.buttonStyle} onPress ={() => setTuesdayEndShow(true)}><Text style={styles2.buttonTextStyle}>Set End Time</Text></TouchableOpacity>
                    <Text style={styles2.buttonTextStyle}>End Time: {tuesdayEndTime.toLocaleTimeString()}</Text>
                {
                tuesdayShow && 
                <TimeInput value={tuesdayTime} onChange ={onTueChange}/>
                }
                {
                tuesdayEndShow &&
                <TimeInput value={tuesdayEndTime} onChange ={onTueEndChange}/>
                }
                </View>
            case 'wednesday':
                return <View>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <Button title ={"Start Time"} onPress ={() => setWednesdayShow(true)}/>
                    <Text>Start Time: {weddayTime.toLocaleTimeString()}</Text>
                    <Button title ={"End Time"} onPress ={() => setWednesdayEndShow(true)}/>
                    <Text>End Time: {weddayEndTime.toLocaleTimeString()}</Text>
                {
                wednesdayShow &&
                <TimeInput value={weddayTime} onChange ={onWedChange}/>
                }
                {
                wednesdayEndShow &&
                <TimeInput value={weddayEndTime} onChange ={onWedEndChange}/>
                }
                </View>
            case 'thursday':
                return <View>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <Button title ={"Start Time"} onPress ={() => setThursdayShow(true)}/>
                    <Text>Start Time: {thursdayTime.toLocaleTimeString()}</Text>
                    <Button title ={"End Time"} onPress ={() => setThursdayEndShow(true)}/>
                    <Text>End Time: {thursdayEndTime.toLocaleTimeString()}</Text>

                {
                thursdayShow &&
                <TimeInput value={thursdayTime} onChange ={onThuChange}/>
                }
                {
                thursdayEndShow &&
                <TimeInput value={thursdayEndTime} onChange ={onThuEndChange}/>
                }
                </View>
            case 'friday':
                return <View>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <Button title ={"Start Time"} onPress ={() => setFridayShow(true)}/>
                    <Text>Start Time: {fridayTime.toLocaleTimeString()}</Text>
                    <Button title ={"End Time"} onPress ={() => setFridayEndShow(true)}/>
                    <Text>End Time: {fridayEndTime.toLocaleTimeString()}</Text>

                {
                fridayShow &&
                <TimeInput value={fridayTime} onChange ={onFriChange}/>
                }
                {
                fridayEndShow &&
                <TimeInput value={fridayEndTime} onChange ={onFriEndChange}/>
                }
                </View>
            case 'saturday':
                return <View>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <Button title ={"Start Time"} onPress ={() => setSaturdayShow(true)}/>
                    <Text>Start Time: {saturdayTime.toLocaleTimeString()}</Text>
                    <Button title ={"End Time"} onPress ={() => setSaturdayEndShow(true)}/>
                    <Text>End Time: {saturdayEndTime.toLocaleTimeString()}</Text>
                    
                {
                saturdayShow &&
                <TimeInput value={saturdayTime} onChange ={onSatChange}/>
                } 
                {
                saturdayEndShow &&
                <TimeInput value={saturdayEndTime} onChange ={onSatEndChange}/>
                }
                </View>
            case 'sunday':
                return <View>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <Button title ={"Start Time"} onPress ={() => setSundayShow(true)}/>
                    <Text>Start Time: {sundayTime.toLocaleTimeString()}</Text>
                    <Button title ={"End Time"} onPress ={() => setSundayEndShow(true)}/>
                    <Text>End Time: {sundayEndTime.toLocaleTimeString()}</Text>

                {
                sundayShow &&
                <TimeInput value={sundayTime} onChange ={onSunChange}/>
                }
                {
                sundayEndShow &&
                <TimeInput value={sundayEndTime} onChange ={onSunEndChange}/>
                }
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

