# FoodSeek

*A Food Social Media Platform*

---

## Goal
Our goal is to connect food insecure people (Our users) with free food.


## Method
Connect our users with food suppliers that are voiding or wasting some food. Get the supplier to hold the food for some amount of time for one of our users to pick the food up.

---

## Generally
In order to implement our goal with our method. We will need
  - A UI for both the User's and Suppliers. (front end react)
  - A shared data structure for them to read and write to. (back end in Node)
  - A method for them to comminucate (back end in Node)
  - Login system for returning user (SQL / Database)


---

## UI

React or Expo

---

## Backend / Server

For our back end we've decied to use Node.js. (v16.17.1)

**(10.7.2022)** Added a method for app.js to connect to the mySQL database and insert new data. 
You can try to add your own data by downloading Postman and making the URL what ever you have app running on
Then issue a PUT with the url /newuser passing a "email" and "password" header

**(10.8.2022)** 
app.js now add users and validate sign in credentials. Added error handling for trying to create accounts with the same email 
(no duplicates). Added error handling for lack of username or password durring sign in.  

Currently the back-end is pretty sparse but we have two working functions for user signup and login.
These functions are handled by calling a HTTP method on a URL

**POST '/newuser'**

Takes in two "parameters"/"headers" with keys ("email", "pass").
If these two keys are not present a response with `statuscode 400` will be returned detailing which key was missing.

If the email value is one that is already on the server a error `ER_DUP_ENTRY` is returned by the mySql package. We have handled it with a custom function `errRespond`.

If both keys are present and there are no conflicts with emails. A `INSERT` is passed to the mySQL database with the new user information

**GET '/login'**

Takes in two paramters with keys ("email", "pass").
Currently no error handling set up for missing keys or anything so it will probably just hang and eventually time out

It checks the database if the user is present and will return a little msg in a json if true. Currently not handling what happens when user isnt present but we can do what ever we want for that its not too hard


**errRespond(err)**

The `errRespond` method takes in a single parameter `err`. This `err` is generated during the response cylce in any app.METHOD, or in the database calls.
It returns a list as output with the following fields : `[0:status code for error, 1: json msg for error, 2:fatal]`
`[0]` : what status code the response will get based on that error
`[1]` : JSON object returned in the response
`[2]` : Fatal is 1 if the program should halt, and 0 if we can continue after the error

This function gets it's intended job done, but I would like to rethink the strategy and see if it can be cleaned up some more.
Currently you have to save the results of this function in a variable, and then set the response inside the METHOD body to items of that variable.
In an ideal situation we could just call this function and the response would automatically get filled out instead.

**terminate(err)**

This function makes sure to close the DB pool before throwing what ever error we pass as `err` and halting the program.
Typically this will be called if `errRespond(err)[2] == 1`


**User Auth**

User Auth is sort of working!

Currently we have a means to store session data from a user on the SQL database and return that information to a user. There are a ton of bugs so far but that's  the game.

Most of the 10/10 was spent creating the memstore.js MyStore class. The reasoning for its creation is that the package "express-session" which lets us track user information for a session requires a memory store class. The provided one only works on memory and "is not meant for production". Creating the class was an absolute hassle but now we have something.



**MyStore**

The class `MyStore` extends the express-session class `Store` in order to incorperate a lot of the basic functionality.

Three  methods are required to implement this class, `get(sid, cb)`, `set(sid, session, cb)`, `destroy(sid, cb)`. The getter takes a session id and returns a session object if found (this object contains that users cookies for the session), set places session date in the database given a session id, and destroy removes a session from the database given a session id. The last argument `cb` is a callback function that is returned at the end of each function call. There is more specific information in the memstore.js file.

There are also some othe features I implemented in here. `touch(sid, cb)` "touches" a session aka gives it a new expiration time. I also implemented a means to remove expired sessions. 



---
## Data Base

Currently the database is being run on a MySQL server on my (Cal) computer. 

We are connecting to it via a Node package called mySql. Using this node package we create a database connection pool called `db_pool`
in order to avoid exess code required to handle individual connections.

The database is live and currently accepting information from the server connections.


