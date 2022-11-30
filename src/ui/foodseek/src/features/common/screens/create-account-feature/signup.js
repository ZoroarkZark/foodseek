import React, { useContext, useState } from 'react'
import { Text, View, Button } from 'react-native'
import { AuthenticationContext } from '../../../../context/AuthenticationContext'
import { UserForm, VendorForm, BaseForm } from '../../../../components/forms'
import { ScrollViewDismissKeyboard, TextButton, Title } from '../../../../components/common'

// Function returns the user registration screen as a component
export const Signup = ({ navigation }) => {
    const { onSignup, loading } = useContext(AuthenticationContext)

    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$')
    const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$')
    const validPhone = new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')

    // variables used for conditional rendering vendor or user forms
    const [state, setState] = useState('Base')
    const [prev, setPrev] = useState('Base')

    // block contains: form variables and mutators
    const [fn, setFn] = useState('') // first name
    const [ln, setLn] = useState('') // last name
    const [phone, setPhone] = useState('') // phone number
    const [un, setUn] = useState('') // username
    const [loc, setLoc] = useState('') // location
    const [email, setEmail] = useState('') // email
    const [pwd, setPwd] = useState('') // password
    const [acc, setAcc] = useState(null) // account type (vendor/seeker)
    const [bn, setBn] = useState('') // business name
    const [ba, setBa] = useState('') // business address
    const [bphone, setBPhone] = useState('') // business phone number
    const [bemail, setBEmail] = useState('') // business email
    const [inc, setInc] = useState('') // income or earnings
    const [period, setPeriod] = useState('') // pay period
    const [ptravel, setPTravel] = useState('') // travel preference

    // function applies logic behind conditionally displaying the form fields
    const renderSwitch = (state) => {
        switch (state) {
        case 'Base': 
            return (
                //The form that everyone will use. 
                /* Will take: firstname (fn), lastname (ln), phoneNumber (phone), email address (email)
                              password (pwd), accountType (acc).
                            
                   As it applies to everyone's account. Accounttype will distinguish which form to use.
                */
                <BaseForm
                    fn={fn}
                    ln={ln}
                    phone={phone}
                    email={email}
                    pwd={pwd}
                    acc={acc}
                    setFn={(firstName) => setFn(firstName)}
                    setLn={(lastName) => setLn(lastName)}
                    setPhone={(phonenumber) => setPhone(phonenumber)}
                    setEmail={(email) => setEmail(email)}
                    setPwd={(password) => setPwd(password)}
                    setAcc={(accountType) => setAcc(accountType)}
                />
            )
        case 'Vendor':
            return (
                //The form that only the Vendor signing up will use. 
                /* Will take: businessName (bn), businessAddress (ba), businessPhone (bphone), businessEmail (bemail).
                            
                   This information will be what the Vendor uses to identify itself.
                */
                <VendorForm
                    bn={bn}
                    ba={ba}
                    bphone={bphone}
                    bemail={bemail}
                    setBn={(businessName) => setBn(businessName)}
                    setBa={(businessAddress) => setBa(businessAddress)}
                    setBPhone={(businessPhone) => setBPhone(businessPhone)}
                    setBEmail={(businessEmail) => setBEmail(businessEmail)}
                />
            )
        case 'User':
            return (
                //The form that only the Seeker (User) signing up will use. 
                /* Will take: username (un), local (loc), income (inc), pay period (period), and travel preference (ptravel).
                            
                   This information will be what the Seeker (User) uses to identify itself.
                */
                <UserForm
                    un={un}
                    loc={loc}
                    inc={inc}
                    period={period}
                    ptravel={ptravel}
                    setUn={(username) => setUn(username)}
                    setLoc={(local) => setLoc(local)}
                    setInc={(income) => setInc(income)}
                    setPeriod={(payperiod) => setPeriod(payperiod)}
                    setPTravel={(travelPreference) =>
                        setPTravel(travelPreference)
                    }
                />
            )
        }
    }

    // button triggered event: updates the state based on user input
    const updateState = () => {

        if (acc === 0) { // If the given account type is 0 (User)...
            setPrev(state) //Save the current state as the previous state, allowing you to go back.
            setState('User') //Set the current state to the user state, bringing up the user's form.

        } else if (acc === 1) { // If the given account type is 1 (Vendor)...
            setPrev(state) //Save the current state as the previous state, allowing you to go back.
            setState('Vendor') //Set the current state to the vendor state, bringing up the vendor's form.

        } else { //If you have no input...
            alert('User must choose to be vendor or seeker...') //Just throw out an alert.
        }
    }

    // button triggered event: behavior for the back button
    const goBack = () => {
        let temp = prev 
        setPrev(state) //Save the current state as the previous state, allowing you to go back.
        setState(temp) //Go back to the previous state.
    }

    // button triggered event: form submission behavior
    const onSubmit = async () => {
        // organize data before sending request
        const base = {
            fn: fn, //first name
            ln: ln, //last name
            phone: phone, //phone number
            email: email, //email address
            // pwd: pwd, //password
        }
        const data = {
            vendor: acc, //account type: 0 (User), 1 (Vendor)
            seek: {
                ...base, //Information from base remains.
                un: un, //User name
                loc: loc, //Location
                inc: inc, //Income
                period: period, //Pay period
                ptravel: ptravel, //Travel preference
            },
            vend: {
                ...base, //Information from base remains.
                bn: bn, //Business name
                ba: ba, //Business address
                bphone: bphone, //Business phone number
                bemail: bemail, //Business email address
            }
        }
        let result = await onSignup(email, pwd, data) //Wait until 
        navigation.goBack();
    }

    // renders the title, a return to login button, and conditionally renders form fields and buttons based on user input
    return (
        <View
            style={{
                flex: 3,
                paddingHorizontal: 20,
                paddingTop: 30,
            }}
        >
            <ScrollViewDismissKeyboard>
            <Title>Create Account</Title>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={{ fontWeight: '400', fontSize: 14 }}>
                    Already have an account?
                </Text>
                <TextButton
                    style={{ color: 'green' }}
                    onPress={() => navigation.navigate('Login')}
                >
                    Login
                </TextButton>
            </View>
            {renderSwitch(state)}
            {state !== 'Base' ? (
                <Button title="Submit" onPress={() => onSubmit()}>
                    Insert submission behavior
                </Button>
            ) : (
                <></>
            )}

            {state === 'Base' ? (
                <Button title="Continue" onPress={() => {
                    if(!validEmail.test(email))
                        alert("Invalid email")
                    //password requires numbers and letters
                    else if(pwd < 3)
                        alert("Invalid Password! Password must be greater than 3")
                    else if(!validPhone.test(phone))
                        alert("Invalid Phone!")
                    else
                        updateState()
                    }}>
                    Advances to the secondary form pages
                </Button>
            ) : (
                <Button title="Back" onPress={() => goBack()}>
                    Returns to previous page
                </Button>
                )}
            </ScrollViewDismissKeyboard>
        </View>
    )
}

