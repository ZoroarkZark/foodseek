import React, { useState, createContext } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const createAccount = (usr) => {
        setLoading(true);
        if (usr && !user){
            setUser(usr);
            setLoading(false);
        }else{
            console.log(`Please log out before creating an account... currently logged in is: ${user}`);
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const printUser = () => {
        //return user ? console.log(JSON.stringify(user)) : console.log("There is no user logged in...");
    };

    return (
        <AuthContext.Provider value={{loading, user, setLoading, setUser, createAccount, logout, printUser}}>
        {children}
        </AuthContext.Provider>
    );


};