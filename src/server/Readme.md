# Backend Becky

## Routing

### app.js

This is where the core functionality of our server takes place. Routers and middleware are all mounted here.

A lot of the middleware functionality was moved to seperate folders in `src/server/routes`

### Request Errors
* [00] : "fallthrough error (nothing happened)"
* [01] : "Bad Body (No body or required keys)"
* [02] : "Invalid JWT (Didnt verify or jwt had a bad time)"
* [03] : "Wrong User Permission (vendor/user)"
* [04] : "Bcrypt Hash Error"
* [05] : "Bad password"
* [06] : "Bad Email (signup:already in db, login:not in db)"
* [07] : "" tbd


### routes/core.js
All of the core routes are mounted to `/`

The core routes of the server include (* items mean not included yet):
* `/signup`
* `/login`
* `/test`
* `/rem`
* `/fgpass*`
* `/newpass*`

`/signup` : create a new user
* Must POST
* Body must contain fields `email`, `pass`, and `vendor`
* Response:
    * successful signup -> `{success: 1, data: {msg: "successful signup"}, issues: null}`
    * Errors (code):(message)
        * no body data -> (1):("No Body Data")
        * invalid fields -> (2):("Invalid Fields")
        * Storage Error  -> (n):(error message determined by system error class)

`/login` : login existing user
* Must POST
* Body must contain fields `email` and `pass`
* Response:
    * successful login -> `{success: 1, data{user: username, vendor: vendor_status, jwt: jwt_token, message: "user signed in"}, issues: null}`
    * Errors (code):(message)
        * no body data   -> (1):("No Body Data")
        * invalid fields -> (2):("Invalid Fields")
        * No email found -> (3):("No Account Found")
        * Bad pass       -> (4):("Passwords did not match!")


`/test` : test 
* dev feature
* Method determines functionality
* A GET will return `{msg: "get successful"}`
* A POST
* Response:
    * successful test -> `{success: 1, data: {body from request}, issues: null}`

`/rem`: remove all users
* dev feature 
* Methodless (any method is fine)
* removes all users from Store
* Response:
    * successful rem -> `{success: 1, data {msg: removed users}, issues: null}`

### routes/user.js
User Actions (have to be signed in to use) are all mounted on `/user/` as of right now
So a foodcard route would be `user/upl`

`/list` : retrieve a list of foodcard items
* Must GET
* Response:
    * success: data contains the list of foodcard items (I only return the two uploaded fields for brevity)
    * error: not incorperated yet


### routes/vendor.js
Vendor Actions actions are all mounted on `/vendor/`


`/upl`: upload food card
* Must POST
* There are a lot of fields for the foodcards I have slimmed down the number of input fields required.
    * they stil have all the fields. The non funcional fields are just insignifgant strings
* Body must contain fields `id` and `item`
* Response:
    * success returns a msg: "uploaded card
    * errors:
        * 1, no body
        * 2, no fields
        * 3, duplicate card


`/del`

`/conf`

---

## sqlhandler.js
This is where all the SQL is handled(if you could not guess). 

Currently the two classes support general uploads, and gets on the tables.
We are looking to implement some more features for the FoodStore like filtering the results a little bit better and such


---

## Utility

Utility features are currently stored in `src/server/utility`

### serverutility.js

`res_obj`: the response object made into an easily interatable type for server use
* success : 0 or 1
* data    : data from response or `null` if `success==0`
* issues  : issues from response or `null` if `success==1`
* setData(`object`):
    * sets `success` = 1
    * sets `data` = `object`
* setIssues(`object`):
    * sets success = 0
    * sets `issues` = `object`
* setIssue(`code`, `msg`):
    * sets success = 0
    * sets issues = `{
        error: code,
        msg: msg
    }`
* package():
    * JSON.stringifies this

*example*

A successful login will look like this as a res_obj:
`{success: 1, data: {user: username, jwt: token, vendor: vend_status, msg:"successful login"}, null}`


`food_card` : the food card object for the FoodStore (gonna move this)
* has all the food card fields
    * id
    * image
    * vendor
    * favorite
    * cuisine
    * item
    * travel
    * reserved


`validate(fields, object)`: returns true if all fields are in object
* `fields`::array
* `object`::object
* iterates through all items passed in `fields` and checks if `in` `object`

*this is used to quickly see if a request has the desired fields for an operation*

`sign(payload)`: returns a signed jwt token

`verify(token, cb)`: returns a callback with the data  if the token is valid else returns an error

### DataBase Stores

Currently the `live` stores are in `sqlhandler.js`. However testing versions are relying on memory stores `UserStore` and `FoodStore` from `serverutils.js`. The DBHandler is in line for a rewrite so im only going to cover the fakestores. The fakestores represent the entire implementation for the actual stores so in live versions when they are working will just be substituted in *no problem*.

### UserStore : store user data

`UserStore()`:
* initializes the store object

`insertUser(credentials, callback)`: insert a user based on credentials and call callback when fulfilled
* `credentials`::object
* `callback`::function
* returns:
    * if success: callback(null)
    * on error: callback(error)

`getUser(email, callback)`: get user information based on an email provided
* `email`::string
* `callback`::function
*  returns:
    * success: callback(null, result)
    * error: callback(error, null)


### FoodStore : store food_card data

`FoodStore()`:
* initializes the store object

`uploadCard(fooddata, callback)`: insert a user based on credentials and call callback when fulfilled
* `fooddata`::object
* `callback`::function
* returns:
    * if success: callback(null)
    * on error: callback(error)

`getCardsAll(callback)`: get user information based on an email provided
* `callback`::function
*  returns:
    * success: callback(results)

---

## Device.html : my baby

Located in `src/server/tests`, the Device.html provides a UI for making requests and reading responses to and from our server.

You should be able to run this file from anywhere and have it work with our server (as long as the server is running at that address)

`Settings`: change host and port
* kinda shitty but it literally just sets the html elements to the host and port
* you can change but if the page is refrehsed will go back to defualt values

`Request API`: settings for the request
* url : type the path, will be appended to `http://host:port`
* select either Get or Post for the method
* Pass body paramaters:
    * key=value,key1=val1,...
    * is equivalent to {key: val, key1:val1}

`Response` : displays the response

`Usage`: usage details

Inside theres a lot going on but the important feature that is being extrapolated to the actual device interface is 
`xhrRequest(url, method, payload, cb)`:
* `url`::string
* `method`::string
* `payload`::object
* `cb`::function
* returns:
    * success: returns `cb(null, response_data)`
    * error: returns `cb(status_code, null)`


