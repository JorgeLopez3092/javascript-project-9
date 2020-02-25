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

&

localhost:5000/api/courses

However, all interactions are locked behind an authenticator (basic-auth), so you'll need to use the Authorization tab in Postman.  First select 'Basic Auth' from the 'Type' drop down menu and then you'll need to fill out the form to the right.

There are 2 initial logins you can use to start interacting.

Username: joe@smith.com
Password: joepassword

&

Username: sally@jones.com
Password: sallypassword

Please note that usernames are case sensitive at the moment.  Will make them case insensitive soon

Once you have the username and password entered in the proper fields, you can start navigating.

# Routes

GET localhost:5000/api/users will the full name and username of the authenticated account.

GET localhost:5000/api/courses will return all courses that currently exist in the database along with the related teacher (user) from the Users table.

POST localhost:5000/api/users will allow you to pass in a JSON object that will create a new user in the database.  All fields are required for POSTing a username.  Here is the structure:

```
{
   "firstName": STRING, (required)
   "lastName": STRING, (required)
   "emailAddress": STRING, (required)
   "password": STRING (required)
}
```

POST localhost:5000/api/courses will allow you to pass in a JSON object that will create a new course in the database.  Some fields are required and some are optional.  Here is the structure.

```
{
   "title": STRING, (required)
   "description": TEXT, (required)
   "estimatedTime": STRING, (optional)
   "materialsNeeded": STRING, (optional)
   "userId": INTEGER (required. And it must be an existing ID for an entry in the Users table.  This is the foreignKey to the User's primary key)
}
```

PUT localhost:5000/api/courses/:id will allow you to update the course with the id passed into the route.  There are no required fields here, only the properties that need to be updated should be passed into the JSON object here.  For example, if I only wanted to update the description, then here is what my JSON object would look like.

```
{
   "description": STRING
}
```
DELETE localhost:5000/api/courses/:id will allow you to delete the course, with the id passed into the route, from the database.

This is my practice work in progress API. =]