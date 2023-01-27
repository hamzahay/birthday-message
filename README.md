# birthday-message

### npm run
- db:create
- db:create:dev
- db:create:test
- db:migration
- db:migration:dev
- db:migration:test
- nodemon (start nodemon app)
- start (start node app)
- test (start jest supertest test in test db)

### api

POST - http://localhost:3030/user/addUser

- Request (body)
  {
    firstName: String,
    lastName: String,
    email: String (email),
    birthDate: Date (yyyy-mm-dd),
    location: String (region/city ex: Australia/Sydney, Asia/Jakarta, America/Los_Angeles)
  }

- Response
  {
    {
      "id": Integer,
      "firstName": String,
      "lastName": String,
      "email": String (email),
      "birthDate": Date,
      "location": String,
      "updatedAt": Date,
      "createdAt": Date
    }
  }

PUT - http://localhost:3030/user/editUser/:id

- Params
  id: Integer

- Request (body) 
  {
    firstName: String,
    lastName: String,
    email: String (email),
    birthDate: Date (yyyy-mm-dd),
    location: String (region/city ex: Australia/Sydney, Asia/Jakarta, America/Los_Angeles)
  }

- Response
  [
    1,
    [
      {
        "id": Integer,
        "firstName": String,
        "lastName": String,
        "email": String (email),
        "birthDate": Date,
        "location": String,
        "updatedAt": Date,
        "createdAt": Date
      }
    ]
  ]

DELETE - http://localhost:3030/user/deleteUser/:id

- Params
  id: Integer

- Response
  {
    "msg": "User Deleted"
  }