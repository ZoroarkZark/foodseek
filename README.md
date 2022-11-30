
Notion Link: https://www.notion.so/FoodSeek-df08685c3bba4df5837135106df0bd04

# OLDER README

---

# FoodSeek

*A Food Social Media Platform*

---

# Goal
Our goal is to connect food insecure people (Our users) with free food.


# Method
Connect our users with food suppliers that are voiding or wasting some food. Get the supplier to hold the food for some amount of time for one of our users to pick the food up.

---

# General Structure
In order to implement our goal with our method. We will need
  - A UI for both the User's and Suppliers. (front end react)
  - A shared data structure for them to read and write to. (back end in Node)
  - A method for them to comminucate (back end in Node)
  - Login system for returning user (SQL / Database)


---

# UI/Frontend

In order to create our UI for the app that we'll be making, we have decided to use React Native alongside Expo; this will allow us to create a project to put in all of our components.
In other words, we are using Expo for our front-end.

---

# Backend / Server

For our back end we've decied to use Node.js. (v16.17.1)

**(10.7.2022)** Added a method for app.js to connect to the mySQL database and insert new data. 
You can try to add your own data by downloading Postman and making the URL what ever you have app running on
Then issue a PUT with the url /newuser passing a "email" and "password" header

**(10.8.2022)** 
app.js now add users and validate sign in credentials. Added error handling for trying to create accounts with the same email 
(no duplicates). Added error handling for lack of username or password durring sign in.  

Currently the back-end is pretty sparse but we have two working functions for user signup and login.
These functions are handled by calling a HTTP method on a URL


---
## app.js

**POST '/newuser'**

Takes in two "parameters"/"headers" with keys ("email", "pass").
If these two keys are not present a response with `statuscode 400` will be returned detailing which key was missing.

If the email value is one that is already on the server a error `ER_DUP_ENTRY` is returned by the mySql package. We have handled it with a custom function `errRespond`.

If both keys are present and there are no conflicts with emails. A `INSERT` is passed to the mySQL database with the new user information

**GET '/login'**

Takes in two paramters with keys ("email", "pass").
Currently no error handling set up for missing keys or anything so it will probably just hang and eventually time out

It checks the database if the user is present and will return a little msg in a json if true. Currently not handling what happens when user isnt present but we can do what ever we want for that its not too hard

**POST '/signup'**

Takes in two parameters with keys ("email", "pass").
Currently no error handling set up for missing keys or dup entry so it will probably just hang and eventually time out

It added the email and pass to the database 

**GET '/logout'** 
Takes no parameters

It sets the session of the user to null and destroys the session which logs them out 

---
## MyStore : Express-Session Store class for our SQL server
MyStore extends all the functionality of a Express-Session.Store class but is tooled for our database only. This was needed because Express-Session will automatically store to memory instead of a database which is not meant for production

**Constructor(connection)** : to create a MyStore instance pass it a database connection 

**get(sid, callback)**
Takes a session id and a callback function, returns the users session data, or error if it couldnt find one 

`callback(error, results)` : results are returned in the callback

**set(sid, session, callback)**
Takes a session id , session , and a callback function , sets the session into the database

`callback(error)` : callback is there to handle errors

**touch(sid, session, callback)**
Takes a session id , session , and a callback function, updates the session expire time

`callback(error)` : errors or null basically

**destroy(sid, callback)**
Takes a session and a callback function, destroys the session by deleting it from the database

`callback(err)` : errors or null

**clearExpired()**
Cleares expired sessions using the interval `expireInterval` which is set in the constructor. 

**setExpirationInterval(interval)**
Takes an interval(time), sets the expire time of the session to interval

---

## DBHandler : Handles the user_data SQL table
DBHandler is responsible for creating and selecting users from the database. I think this will also be how we do food cards in the future

**Constructor(options)** : The Options args represent the column names for the data we are manipulating in SQL and the connection pool used

**insertUser(email, password, callback)**
Takes user email, password , and a callback function. It inserts a new user into the database 

`callback(err)` : error or null

**getUser(email, callback)**
Takes the user email and a callback function , returns the password if it finds the user , if no user found returns null to the callback

`callback(err, pass)` : if there is an error callback will be given it, if the password is found it will be in the pass arg

---

## ServerInterface: Handles making requests to the backend
The ServerInterface will be the connection between the front and backend. 
To use the ServerInterface add `const ServerInterface = require('./serverhandler.js')` *you will need to change the path for what ever file you are in relative to the server folder*

Then instantiate an object with `const SI = new ServerInterface(base)`


**Constructor(base)** : base is the base connection information for the requests. Mandatory fields are host and port
*the body_data must be parsed to JSON before use*

**createAccount(credentials, callback)**

`credentials` : JSON object containing fields (`email`, `pass`)

`callback(body_data)` : callback handles the body data recieved from the request (this is where you will get the servers response essentially)

`body_data`: is the JSON response of our server. For this particular request it contains one field.
- `body_data.issue` = 0:no issues on creation, 1:acc already exists, 2:bad error contact support


**loginUser(credentials, callback)**

`credentials` : JSON object containing fields (`email`, `pass`)

`callback(body_data)`: handle the body data recieved from the request

`body_data`: JSON object recieved from the response
- `body_data.issue`: 0:none, 1:no email (no acc), 2:bad pass, 3:contact supprt
- `body_data.user` : the user of the account
- `body_data.pass` : the pass for the account (this is not needed and only for debugging)
- `body_data.vend` : vendor status (not implemented but you will still get a value here)

**logoutUser(callback)**

`callback(body_data)` : handle the body data from the response

`body_data` : JSON object from response
- `body_data.issue`: 0:none, 1:something bad happened trying to logout


---
# Data Base

Currently the database is being run on a MySQL server on my (Cal) computer. 

**Current Tables That Matter**

## user_data

**cols**
- userid: auto-incrementing, unique key for users
- user_email: the email as input by the user
- password: password as input by the user

## session_data

**cols**
- session_id: the session id for the session
- session_obj: the stringified object for the session
- expires: time as an int (in seconds) until this expires
- vendor : idk if this should be here but vendor status


