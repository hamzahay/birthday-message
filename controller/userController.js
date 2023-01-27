const { user } = require('../models')
const moment = require('moment')
const CronJob = require('cron').CronJob
const axios = require('axios')

class Controller {

  static async addUser (req, res, next) {
    try {
      const { firstName, lastName, email, birthDate, location } = req.body
      const birthDateJsDate = moment(birthDate).format()
      
      const response = await user.create({ firstName, lastName, email, birthDate: birthDateJsDate, location })
      console.log('response', response)
      res.status(200).json({ ...response.dataValues })
      // const birthdayCronJob = await Controller.setBirthDayCronJob(birthDateJsDate, location, response.dataValues.id)

      // setTimeout(() => { // stop cronJob for testing
      //   birthdayCronJob.stop()
      //   console.log('cronStop')
      // }, 35000)

    } catch (err) {
      console.log('err', err)
      res.status(500).json(err)
    }
  }

  static async updateUser (req, res, next) {
    const { id } = req.params
    const body = req.body
    let data = {}
    let isChangeDate = false
    let oldDataValues

    try {
      for (let key in body) {
        if (body[key] !== '' && body[key] !== null && body[key] !== undefined) {
          if (key === 'birthDate') {
            data[key] = moment(body[key]).format()
          } else {
            data[key] = body[key]
          }
          if (key === 'birthDate' || key === 'location') isChangeDate = true
        }
      }

      if (isChangeDate) {
        const oldRes = await user.findByPk(id)
        oldDataValues = oldRes.dataValues
      }
  
      console.log('=====================||====================>', id)
      const response = await user.update(data, { where: { id }, returning: true })
      res.status(200).json(response)
      const dataValues = response[1][0].dataValues
      const birthDateJsDate = moment(dataValues.birthDate).format()

      if (isChangeDate) {
        if (moment(dataValues.birthDate).format() !== moment(oldDataValues.birthDate).format() || dataValues.location !== oldDataValues.location) {
          moment(dataValues.birthDate).format() !== birthDate || dataValues.location !== currLocation
          const birthdayCronJob = await Controller.setBirthDayCronJob(birthDateJsDate, dataValues.location, dataValues.id)
          // setTimeout(() => { // stop cronJob for testing
          //   birthdayCronJob.stop()
          //   console.log('cronStop2')
          // }, 130000)
        }
      }
    } catch (err) {
      console.log('err', err)
      res.status(500).json(err)
    }
  }

  static async deleteUser (req, res, next) {
    const { id } = req.params
    try {
      const response = await user.destroy({ where: { id } })
      res.status(200).json({ msg: 'User Deleted' })
    } catch (err) {
      console.log('err', err)
      res.status(500).json(err)
    }
  }

  static async setBirthDayCronJob (date, location, userId) {
    try {
      const month = moment(date).month()
      const day = moment(date).date()

      const cronTime = `0 0 9 ${day} ${month} *` // cronTime once a year at user birthday at 9 am
      // const cronTime = `0 41 0 ${day} ${month} *` // cronTime for testing
      // const cronTime = `*/15 * * * * *` // cronTime every 15 sec for testing

      const job = new CronJob(
        cronTime,
        async function () {
          const id = userId
          const birthDate = moment(date).format()
          const currLocation = location
          try {
            const userRes = await user.findByPk(id)
            if (userRes === null) { // stop cronJob when user is deleted
              this.stop()
              return ''
            } else {
              const dataValues = userRes.dataValues ? userRes.dataValues : {}
              if (moment(dataValues.birthDate).format() !== birthDate || dataValues.location !== currLocation) { // stop cronJob when user birthDate or location change
                this.stop()
                return ''
              } else {
                const mailRes = await Controller.sendEmail(dataValues)
                if (mailRes === false) {
                  Controller.startRepeatEmailCronJob(birthDate, currLocation, id)
                }
              }
            }
          } catch (err) {
            console.log('err', err)
            this.stop()
            console.log('stop cron job')
          }
        },
        null,
        true,
        location // timezone
      )
      return job
    } catch (err) {
      console.log('cronErr', err)
    }
  }
  static async startRepeatEmailCronJob (date, location, userId) { // try to send unsent email every 1 hour until it succeed
    try {
      const cronTime = `0 0 * * * *` // cronTime every hour
      // const cronTime = `*/5 * * * * *` // cronTime every 5 sec for testing
      const job = new CronJob(
        cronTime,
        async function () {
          const id = userId
          const birthDate = moment(date).format()
          const currLocation = location
          try {
            console.log('repeat attemp email cron')
            const userRes = await user.findByPk(id)
            if (userRes === null) { // stop cronJob when user is deleted
              this.stop()
              return ''
            } else {
              const dataValues = userRes.dataValues ? userRes.dataValues : {}
              if (moment(dataValues.birthDate).format() !== birthDate || dataValues.location !== currLocation) { // stop cronJob when user birthDate or location change
                this.stop()
                return ''
              } else {
                const mailRes = await Controller.sendEmail(dataValues)
                if (mailRes === true) {
                  this.stop()
                  console.log('email sent, stop cronJob')
                }
              }
            }
          } catch (err) {
            console.log('err', err)
          }
        },
        null,
        true
      )
      return job
    } catch (err) {
      console.log('err', err)
    }
  }

  static async sendEmail (dataValues) {
    const fullName = `${dataValues.firstName} ${dataValues.lastName}`
    const message = `Hey, ${fullName} it’s your birthday`

    try {
      const { data } = await axios.post('https://email-service.digitalenvision.com.au/send-email', { email: dataValues.email, message })
      console.log('dataAxios', data)
      return true
    } catch (err) {
      console.log('err', err)
      return false
    }
  }
}

module.exports = Controller;