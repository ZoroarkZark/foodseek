import React from "react";
import { Button, View} from "react-native";
import { TextInput } from "react-native-paper";
import { Text } from "react-native";
import { CustomTextInput, PickerInput, TransitPickerInput} from "../common";

const options = [
    {label: 'monthly', value: 'monthly'},
    {label: 'bi-weekly (every two weeks)', value:'bi-weekly'},
    {label: 'annually (yearly)', value: 'yearly'},
    {label: 'daily', value:'daily'},
    {label: 'other', value: 'other'},
];

const UserAccountForm = (props) => {
    return (
    <>
        <Text>Username</Text>
        <CustomTextInput value={props.un} onChangeText={props.setUn} keyboardType="default">Enter desired username...</CustomTextInput>
        <Text>Location</Text>
        <CustomTextInput value={props.loc} onChangeText={props.setLoc} keyboardType="default">Enter location...</CustomTextInput>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{flex: 1}}>
                <Text>Average Earnings</Text>
                <CustomTextInput value={props.inc} onChangeText={props.setInc} keyboardType="numeric">Enter earnings...</CustomTextInput>
            </View>
            <View style={{flex: 1}}>
                <Text>Pay Period</Text>
                <PickerInput value={props.period} onValueChange={props.setPeriod} options={options}>yearly? daily?</PickerInput>
            </View>
        </View>
        <Text>Prefered Travel Method</Text>
        <TransitPickerInput value={props.pTravel} onValueChange={props.setPTravel}>Choose one...</TransitPickerInput>
    </>
    );
}
export default UserAccountForm;