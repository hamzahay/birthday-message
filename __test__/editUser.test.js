const request = require('supertest')
const app = require('../index')
const models = require('../models')

let updateId = null

describe('PUT/ user/updateUser/:id', function () {
  beforeAll (function (done) {
    // setup
    const body = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'test3@mail.com',
      birthDate: '2022-02-02',
      location: 'Asia/Jakarta'
    }

    console.log('========================================> add User', updateId)
    // execute
    request(app)
    .post('/user/addUser')
    .send(body)
    .end(function (err, res) {
      //error supertest
      if (err) done(err);

      updateId = res.body.id
      done()
    })
  })

  it('should response 200 status code user data change', function (done) {
    // setup
    const body = {
      firstName: 'firstName2',
      lastName: 'lastName2',
      email: 'test4@mail.com',
      birthDate: '2022-02-02',
      location: 'Asia/Jakarta'
    }

    console.log('========================================> update user', updateId)

    request(app)
    .put(`/user/editUser/${updateId}`)
    .send(body)
    .end(function (err, res) {
      // error supertest
      if (err) done(err)

      // assert
      expect(res.statusCode).toEqual(200)
      expect(typeof res.body).toEqual('object')
      expect(res.body[0]).toEqual(1)
      expect(typeof res.body[1]).toEqual('object')
      expect(typeof res.body[1][0]).toEqual('object')

      // res.body[1][0] property depend on the body parameter when api is hit
      expect(res.body[1][0]).toHaveProperty('id')
      expect(res.body[1][0]).toHaveProperty('firstName')
      expect(res.body[1][0]).toHaveProperty('lastName')
      expect(res.body[1][0]).toHaveProperty('email')
      expect(res.body[1][0]).toHaveProperty('birthDate')
      expect(res.body[1][0]).toHaveProperty('location')

      console.log('============================================> done')
      done()
    })
  })

  afterAll(function (done) {
    console.log('========================================> delete User', updateId)
    request(app)
    .delete(`/user/deleteUser/${updateId}`)
    .end(function (err, res) {
      // error supertest delete
      if (err) done(err)
      models.sequelize.close()
      done()
    })
  })
})