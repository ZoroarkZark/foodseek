import React, {useState} from "react";
import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity } from 'react-native';
import { DayPickerInput } from "../../../../components/common/pickerinput";
import { TimeInput } from "../../../../components/common";
import { TimeRange } from "../../../../components/forms";
import styles from '../../../../style/styleSheet';

export const HoursOfOperationScreen = ({navigation}, props) => {
    const [day, setDay] = useState("monday");
    const [isEnd, setisEnd] = useState(false);

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

    const onStartChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        switch (day){
            case 'monday':
                setMondayTime(currentDate);
                setMondayShow(false);
                break;
            case 'tuesday':
                setTuesdayTime(currentDate);
                setTuesdayShow(false);
                break;
            case 'wednesday':
                setWeddayTime(currentDate);
                setWednesdayShow(false);
                break;
            case 'thursday':
                setThursdayTime(currentDate);
                setThursdayShow(false);
                break;
            case 'friday':
                setFridayTime(currentDate);
                setFridayShow(false);
                break;
            case 'saturday':
                setSaturdayTime(currentDate);
                setSaturdayShow(false);
                break;
            case 'sunday':
                setSundayTime(currentDate);
                setSundayShow(false);
                break;
        }
    }

    const onEndChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        switch (day){
            case 'monday':
                setMondayEndTime(currentDate);
                setMondayEndShow(false);
                break;
            case 'tuesday':
                setTuesdayEndTime(currentDate);
                setTuesdayEndShow(false);
                break;
            case 'wednesday':
                setWeddayEndTime(currentDate);
                setWednesdayEndShow(false);
                break;
            case 'thursday':
                setThursdayEndTime(currentDate);
                setThursdayEndShow(false);
                break;
            case 'friday':
                setFridayEndTime(currentDate);
                setFridayEndShow(false);
                break;
            case 'saturday':
                setSaturdayEndTime(currentDate);
                setSaturdayEndShow(false);
                break;
            case 'sunday':
                setSundayEndTime(currentDate);
                setSundayEndShow(false);
                break;
        }
    }

    const onDayChange = (event, selectedDay) => {
        const currentDay = selectedDay;
        setDay(currentDay);
    }

    const renderSwitch = (day) => {
        switch(day){
            case 'monday':
                return <View style={{padding: 20, margin: 10, top: 50}}>
                    
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(false), setMondayShow(true))}><Text style={styles.buttonTextStyle}>Set Start Time</Text></TouchableOpacity>
                    <Text style={styles.buttonTextStyle}>Start Time: {mondayTime.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit"})}</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(true), setMondayEndShow(true))}><Text style={styles.buttonTextStyle}>Set End Time</Text></TouchableOpacity>
                    <Text style={styles.buttonTextStyle}>End Time: {mondayEndTime.toLocaleTimeString()}</Text>
                {
                mondayShow && 
                <TimeInput value={mondayTime} onChange ={onStartChange}/>
                }
                {
                mondayEndShow &&
                <TimeInput value={mondayEndTime} onChange ={onEndChange}/>
                }       
                </View>
            case 'tuesday':
                return <View style={{padding: 20, margin: 10, top: 50}}>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(false), setTuesdayShow(true))}><Text style={styles.buttonTextStyle}>Set Start Time</Text></TouchableOpacity>
                    <Text style={styles.buttonTextStyle}>Start Time: {tuesdayTime.toLocaleTimeString()}</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(true), setTuesdayEndShow(true))}><Text style={styles.buttonTextStyle}>Set End Time</Text></TouchableOpacity>
                    <Text style={styles.buttonTextStyle}>End Time: {tuesdayEndTime.toLocaleTimeString()}</Text>
                {
                tuesdayShow && 
                <TimeInput value={tuesdayTime} onChange ={onStartChange}/>
                }
                {
                tuesdayEndShow &&
                <TimeInput value={tuesdayEndTime} onChange ={onEndChange}/>
                }
                </View>
            case 'wednesday':
                return <View style={{padding: 20, margin: 10, top: 50}}>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(false), setWednesdayShow(true))}><Text style={styles.buttonTextStyle}>Set Start Time</Text></TouchableOpacity>
                    <Text>Start Time: {weddayTime.toLocaleTimeString()}</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(true), setWednesdayEndShow(true))}><Text style={styles.buttonTextStyle}>Set End Time</Text></TouchableOpacity>
                    <Text>End Time: {weddayEndTime.toLocaleTimeString()}</Text>
                {
                wednesdayShow &&
                <TimeInput value={weddayTime} onChange ={onStartChange}/>
                }
                {
                wednesdayEndShow &&
                <TimeInput value={weddayEndTime} onChange ={onEndChange}/>
                }
                </View>
            case 'thursday':
                return <View style={{padding: 20, margin: 10, top: 50}}>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(false), setThursdayShow(true))}><Text style={styles.buttonTextStyle}>Set Start Time</Text></TouchableOpacity>
                    <Text>Start Time: {thursdayTime.toLocaleTimeString()}</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(true), setThursdayEndShow(true))}><Text style={styles.buttonTextStyle}>Set End Time</Text></TouchableOpacity>
                    <Text>End Time: {thursdayEndTime.toLocaleTimeString()}</Text>
                {
                thursdayShow &&
                <TimeInput value={thursdayTime} onChange ={onStartChange}/>
                }
                {
                thursdayEndShow &&
                <TimeInput value={thursdayEndTime} onChange ={onEndChange}/>
                }
                </View>
            case 'friday':
                return <View style={{padding: 20, margin: 10, top: 50}}>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(false), setFridayShow(true))}><Text style={styles.buttonTextStyle}>Set Start Time</Text></TouchableOpacity>
                    <Text>Start Time: {fridayTime.toLocaleTimeString()}</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(true), setFridayEndShow(true))}><Text style={styles.buttonTextStyle}>Set End Time</Text></TouchableOpacity>
                    <Text>End Time: {fridayEndTime.toLocaleTimeString()}</Text>

                {
                fridayShow &&
                <TimeInput value={fridayTime} onChange ={onStartChange}/>
                }
                {
                fridayEndShow &&
                <TimeInput value={fridayEndTime} onChange ={onEndChange}/>
                }
                </View>
            case 'saturday':
                return <View style={{padding: 20, margin: 10, top: 50}}>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(false), setSaturdayShow(true))}><Text style={styles.buttonTextStyle}>Set Start Time</Text></TouchableOpacity>
                    <Text>Start Time: {saturdayTime.toLocaleTimeString()}</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(true), setSaturdayEndShow(true))}><Text style={styles.buttonTextStyle}>Set End Time</Text></TouchableOpacity>
                    <Text>End Time: {saturdayEndTime.toLocaleTimeString()}</Text>
                    
                {
                saturdayShow &&
                <TimeInput value={saturdayTime} onChange ={onStartChange}/>
                } 
                {
                saturdayEndShow &&
                <TimeInput value={saturdayEndTime} onChange ={onEndChange}/>
                }
                </View>
            case 'sunday':
                return <View style={{padding: 20, margin: 10, top: 50}}>
                    <DayPickerInput value={day} onValueChange={setDay}>DAY</DayPickerInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(false), setSundayShow(true))}><Text style={styles.buttonTextStyle}>Set Start Time</Text></TouchableOpacity>
                    <Text>Start Time: {sundayTime.toLocaleTimeString()}</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress ={() => (setisEnd(true), setSundayEndShow(true))}><Text style={styles.buttonTextStyle}>Set End Time</Text></TouchableOpacity>
                    <Text>End Time: {sundayEndTime.toLocaleTimeString()}</Text>
                {
                sundayShow &&
                <TimeInput value={sundayTime} onChange ={onStartChange}/>
                }
                {
                sundayEndShow &&
                <TimeInput value={sundayEndTime} onChange ={onEndChange}/>
                }
                </View>
        }
    }

    return (
    <View>
        {renderSwitch(day)}

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

