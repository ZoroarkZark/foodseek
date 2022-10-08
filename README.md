# FoodSeek

*A Food Social Media Platform*


## Goal
Our goal is to connect food insecure people (Our users) with free food.

## Method
Connect our users with food suppliers that are voiding or wasting some food. Get the supplier to hold the food for some amount of time for one of our users to pick the food up.




## Technical Breakdown

### Generally
In order to implement our goal with our method. We will need
  - A UI for both the User's and Suppliers. (front end react)
  - A shared data structure for them to read and write to. (back end in Node)
  - A method for them to comminucate (back end in Node)
  - Login system for returning user (SQL / Database)


### Specifically

**UI**

React or Expo

**Backend / Server**

For our back end we've decied to use Node.js. (v16.17.1)



**(10.7.2022)** Added a method for app.js to connect to the mySQL database and insert new data. 
You can try to add your own data by downloading Postman and making the URL what ever you have app running on
Then issue a PUT with the url /newuser passing a "email" and "password" header

**(10.7.2022)** 
app.js now add users and validate sign in credentials. Added error handling for trying to create accounts with the same email 
(no duplicates). Added error handling for lack of username or password durring sign in.  

**Data Base**

The data base is running on strawberry pie and portforwarded to allow connection. 
SQL
Going to want to look into login systems and stuff

