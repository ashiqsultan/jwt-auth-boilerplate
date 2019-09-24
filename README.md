# Boilerplate code for JWT Authentication
**Express JS, Mongo DB, JWT**

---

This repo is very minimal, this does only the following task.
* SignUp / Register User
* Login users
* Check validity of token using our simple Auth middleware

<b>NOTE: Make sure to use different Private and Public keys, the ones which are in this repo are only for demonstration purpose.</b>

## SignUp
Post request. Send a POST req to api/signup with email and password in header as JSON type
* Checks email already exists
* If exists sends "Email already registered"
* Else encrypts the password and saves the new user to MongoDB
* Sends back a JWT token

## Login
POST request. Send a POST req to api/login with email and password in Header as JSON type
* Checks email exists in DB
* Compare passwords
* If the both are true then sends a JWT token

## Check validity of JWT token
Send a GET request to api/protectedroute 
This route is protected with the middleware/auth.js
The auth.js in the middleware folder verifies the token.
1. Without token. Response: "No Token, Authorization denied"
2. Send a GET request with incorrect token. Response: "Token is not valid"
3. Send a GET request with correct token. You will be sucessfully taken to the next middleware in the application stack

## How this works
* JWT is generated using a "Private key" and "Token options"
* When a JWT token is received from the client it is checked with a "Public key" and our "Token options"
Note: You can use private keys for both generating and verifying the token

This module doesn't use Passport JS to Authenticate because it is very heavy for this simple task. Use passport.js only if you neeed to Authenticate using social media accounts.

This uses Mongo DB for user data but you can use any Database of your choice.