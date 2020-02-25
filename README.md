# javascript-project-9
 REST API (work in progress)

 Hello!  And welcome to my API app.  (not pronounced appy app)

 To get things started, navigate to this projects folder, and, in the command line, run

 ```
 npm install
 npm run seed
 npm start
 ```

Next, you'll need to install Postman if you haven't already.

There are 2 addresses that can be interacted with in this app.

localhost:5000/api/users
localhost:5000/api/courses

However, all interactions are locked behind an authenticator (basic-auth), so you'll need to use the Authorization tab in Postman.  First select 'Basic Auth' from the 'Type' drop down menu and then you'll need to fill out the form to the right.

There are 2 initial logins you can use to start interacting.
Username: joe@smith.com
Password: joepassword
&
Username: sally@jones.com
Password: sallypassword

Once you have the username and password entered in the proper fields, you can start navigating.

GET localhost:5000/api/users will the full name and username of the authenticated account.

GET localhost:5000/api/courses will return all courses that currently exist in the database along with the related teacher (user) from the Users table.

POST localhost:5000/api/users will allow you to pass in a JSON object that will creat a new user in the database.  All fields are required for POSTing a usrename.  Here is the structure

```
{
   "firstName": STRING,
   "lastName": STRING,
   "emailAddress": STRING,
   "password": STRING
}
```
