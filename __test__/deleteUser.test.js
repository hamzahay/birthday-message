const request = require('supertest')
const app = require('../index')
const models = require('../models')

let deleteId = null

describe('DELETE/ user/deleteUser/:id', function () {
  afterAll(function (done) {
    models.sequelize.close()
    done()
  })

  beforeAll(function (done) {
    // setup
    const body = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'test2@mail.com',
      birthDate: '2022-02-02',
      location: 'Asia/Jakarta'
    }

    // execute
    request(app)
    .post('/user/addUser')
    .send(body)
    .end(function (err, res) {
      //error supertest
      if (err) done(err);

      deleteId = res.body.id
      done()
    })
  })

  it('should response with 200 status code when delete succeed', function (done) {
    // setup

    // execute
    request(app)
    .delete(`/user/deleteUser/${deleteId}`)
    .end(function (err, res) {
      // error supertest
      if (err) done(err)

      // assert
      expect(res.statusCode).toEqual(200)
      expect(typeof res.body).toEqual('object')
      expect(res.body).toHaveProperty('msg')

      done()
    })
  })
})