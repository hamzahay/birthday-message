const request = require('supertest')
const app = require('../index')
const models = require('../models')

let id = null

describe('POST/ user/addUser', function () {
  afterAll(function (done) {
    // clearUsers()

    request(app)
    .delete(`/user/deleteUser/${id}`)
    .end(function (err, res) {
      // error supertest
      if (err) done(err)
      models.sequelize.close()
      done()
    })
  })

  it ('should response with 200 status code when succeed', function (done) {
    // setup
    const body = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'test@mail.com',
      birthDate: '2022-01-01',
      location: 'Asia/Jakarta'
    }

    // execute
    request(app)
    .post('/user/addUser')
    .send(body)
    .end(function (err, res) {
      //error supertest
      if (err) done(err);

      id = res.body.id

      // assert
      expect(res.statusCode).toEqual(200)
      expect(typeof res.body).toEqual('object')
      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('firstName')
      expect(res.body).toHaveProperty('lastName')
      expect(res.body).toHaveProperty('email')
      expect(res.body).toHaveProperty('birthDate')
      expect(res.body).toHaveProperty('location')
      
      done()
    })
  })
})