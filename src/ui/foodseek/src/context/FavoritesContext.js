import React, {createContext, useContext, useState, useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthenticationContext } from "./AuthenticationContext"; // need user's id to modify userspecified key w/ storage variable

export const FavoritesContext = createContext();

export const FavoritesContextProvider = ({children}) => {
    const { user } = useContext(AuthenticationContext);     // get user context
    const [favorites, setFavorites] = useState([]);         // create state holder for the favorites list

    // stores to favorites any value per the users id
    const storeFavorites = async (value, id) => {
        try {
            const json = JSON.stringify(value);     // convert value to json string
            await AsyncStorage.setItem(`@favorites-${id}`, json);  // attempt to save the value to favorites 
        } catch (err) {
            console.log('Save error when saving favorites ', err);
        }
    }

    // loads the favorites list from the users id
    const loadFavorites = async (id) => {
        try {
            const value = await AsyncStorage.getItem(`@favorites-${id}`);    // retrieves a string value given the key for the users favorites list
            return value !== null ? setFavorites(JSON.parse(value)) : null;   // if retrieval was successful return the parsed json object else return empty
        } catch (err) {
            console.log('Read error when loading favorites ', err);
        }
    }

    // called to save a vendor to the favorites list
    const add = (vendor) => {
        setFavorites([...favorites, vendor]);
        // console.log(vendor.id); commented out when not testing
    }

    // removes a vendor from the favorites list
    const remove = (vendor) => {
        const update = favorites.filter((v) => v.id !== vendor.id); // copy the list without the vendor being removed
        setFavorites(update);                                       // set the current favorites to the updated version
    }

    // loads the users favorites into context if the value for user has been updated
    useEffect(() => {
        if (user) {
            loadFavorites(user.id);
        }
    }, [user]);

    // stores the favorites list if the favorites has been updated, or the user has been updated
    
    useEffect(() => {
        if (user) {
            storeFavorites(favorites, user.uid);
        }
    }, [favorites, user]); // handles condition where user is not logged in, but still is adding favorites

    return(
        <FavoritesContext.Provider value={{
            favorites,
            favorite: add,
            unfavorite: remove
        }}>
            {children}
        </FavoritesContext.Provider>
    );
}