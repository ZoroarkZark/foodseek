import React from "react";
import { ToggleButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const ToggleIonIcon = ({ name, value, style}) => (
    <ToggleButton icon={() => { <Ionicons name={name} size={style ? style.size: 24} color={style ? style.color : "black"} />}} value={value} />
  );


const default_options = [
    {name: "walk-outline", value: "walking", style: {color: 'black'}},
    {name: "bicycle", value: "bicycle", style: {color: 'black'}},
    {name: "car-sport-sharp", value: "driving", style: {color: 'black'}},
    {name: "bus-sharp", value: "public transit", style: {color: 'black'}}
];  

const ToggleButtons = ({options}) => {
    return(
        options?.map((option) => ( <ToggleIonIcon name={option.name} value={option.value} style={option.style} />)));
}





const SingleSelectButton = ({value, setValue, options=default_options}) => {
    
    return(
        <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
            <ToggleButtons options={options} />

            
        </ToggleButton.Row>

    );
}

// const SingleSelectButton = ({value, setValue, options=default_options}) => {
    
//     return(
//         <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
//             <ToggleButton icon={() => { <IonIcon name="bicycle"  /> }} value="walking"/>
//         </ToggleButton.Row>

//     );
// }

export default SingleSelectButton;