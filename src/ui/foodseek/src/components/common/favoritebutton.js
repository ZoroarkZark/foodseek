import React, { useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { FavoritesContext } from '../../context/FavoritesContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

// favorite button toggles to empty or full based on if the corresponding vendor is a user favorite, defaults to style for the food cards
const FavoriteButton = ({vendor, style={
  flex: 1,
  color: 'grey',
  backgroundColor: '#fff',
  fontSize: 20,
  size: 30,
  textAlign: 'right',
  alignSelf: 'flex-end',
  justifyContent: 'flex-end',
  paddingVertical: 1,
}}) => {
    const { favorites, favorite, unfavorite } = useContext(FavoritesContext);   // bring in the favorites contexts

    const found = favorites.find((v) => v.id === vendor.id);               // see if the given vendor is apart of the favorites list

    return(
      <TouchableOpacity onPress={() => !found ? favorite(vendor) : unfavorite(vendor)} style={style}>
        <FontAwesome name={found ? "heart" : "heart-o"} color={style? style.color:"black"} style={style}/>
      </TouchableOpacity>
        
    );


    
}

export default FavoriteButton;
