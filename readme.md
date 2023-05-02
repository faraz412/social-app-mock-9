## Social-Media-App

## Tech Stacks Used
- node.js, express.js, mongoose, mongodb

## Features 
-  Authentication
-  Register/Login
-  Crud operations on users and posts schema

### Environment Variables Required
`mongoURL`

`key`

`port` 
   
## API Endpoints
   #### Welcome
```javascript
GET  /api/
```

  #### User Register
```javascript
POST  /api/register

`Request body:
    {
        name: String,
        email: String,
        password: String,
        dob: Date,
        bio: String
    }
`
- Hashing the password.
- Saving user data in database
- Success:  Response with status 201 with message "Successfully Registered".
- Error:  Response with message "Error in Registering".

```
  #### User Login
```javascript
POST  /api/login

`Request body:
    {
        email: String,
        password: String
    }
`
Process:
- Compare password with hashed password in database
- Generate access token
- Success:  Response with status 201 with message "Login Successfull".
- Error:  Response with message "Login error".

```

  #### Fetching all users data
```javascript
GET  /api/users

Process:
- Fetch data from users collection in database
- Respond with status 200 with an array of users data

```

  #### Fetching friends of user with id provided in params
```javascript
GET  /api/users/:id/friends

Process:
- Fetch friends data from users collection in database
- Respond with status 200 with an array of friends data

```

  #### Sending a friend request to user with id provided in params
```javascript
POST  /api/users/:id/friends

Process:
- Update the users friendRequests data with userId of user logged in
- Respond with status 201 with message "Friend request sent"


```
  #### Accept Friend request
```javascript
PATCH  /api/users/:id/friends/:friendId

Process:
- Fetch user from user id and friend id from params
- Update friends data in users collection with friend id.
- Remove friend id from friendRequests data
- Respond with message "Friend request accepted"

```

  #### Fetching all posts data
```javascript
GET  /api/posts

Process:
- Fetch posts data from posts collection in database
- Respond with status 200 with an array of posts data

```

  #### Fetching post data with id provided in params
```javascript
GET  /api/posts/:id

Process:
- Fetch data of post with id given in params
- Respond with status 200 with the post object

```
  #### Add new Post
```javascript
POST  /api/posts

`Request body:
    {
        text: String,
        image: String
    }
`
Process:
- Add new post in posts collection and in user collection of user logged in
- Respond with status 201 with message "New post added".

```

  #### Update a post
```javascript
PATCH  /api/posts/:id

`Request body:
    {
        text: String,
        image: String
    }
`

Process:
- Update post with id provided in params in posts collection and in user collection of user logged in
- Respond with message "Post updated"

```

  #### Delete a post
```javascript
DELETE  /api/posts/:id

Process:
- Delete post with id provided in params in posts collection and in user collection of user logged in
- Respond with message "Post deleted"

```

  #### Like a Post
```javascript
POST  /api/posts/:id/like 

Process:
- Update likes data of post with id provided in params in posts collection with userId of user logged in
- Respond with status 201 with message "Likes updated".

```

  #### Add a comment
```javascript
POST  /api/posts/:id/comment 

Process:
- Update comments data of post with id provided in params in posts collection with userId of user logged in
- Respond with status 201 with message "Comments updated".

```