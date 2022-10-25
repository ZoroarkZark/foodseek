import React, {createContext, useState} from "react";
import { loginRequest, signupRequest, logoutRequest } from "../components/services/authentication.service";

export const AuthenticationContext = createContext();

// provides a wrapper for sharing global context and mutator functions for authentication of the user session (leading to a logged in or logged out status)
export const AuthenticationContextProvider = ({children}) => {
    const [loading, setLoading] = useState(false);                  // create state holder for setting the loading state (while waiting for request responses show loading behavior)
    const [user, setUser] = useState(null);                         // create state holder for user (currently logged in)
    const [error, setError] = useState('');                        // create state holder for storing error state for logging in

    // checks if incoming user is valid or null and updates the user
    const checkAuthState = (usr) => {
        if (usr) {
            setUser(usr);
            setLoading(false);
        }
    }

    // function called when logging into an account
    const onLogin = (email, password) => {
        setLoading(true);                      // set loading status = true while making request for login
        loginRequest(email, password).then((u) => {
                setUser(u);
                setLoading(false);
            }).catch((err) => {
                setLoading(false);
                setError(err.toString());
            });
    }

    // function called when signing up for an account
    const onSignup = (email, password, data) => {
        setLoading(true);
        // return error for data checks client side
        if (!data) {
            setError('Error: no data provided when creating account');
            return;
        }
        // call signup request and set user
        signupRequest(email, password, data).then((u) => {
            setUser(u);
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
            setError(err.toString());
        });
    }

    // function called when logging out of the application
    const onLogout = () => {
        setUser(null);
        logoutRequest();
    }

    return (
        <AuthenticationContext.Provider value={{
            isAuthenticated: !!user,
            loading,
            user,
            error,
            onLogin,
            onSignup,
            onLogout,
        }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
}