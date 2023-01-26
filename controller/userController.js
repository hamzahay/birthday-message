const { user } = require('../models')
const moment = require('moment')
const CronJob = require('cron').CronJob
const axios = require('axios')

class Controller {

  static async addUser (req, res, next) {
    console.log('this', this)
    try {
      const { firstName, lastName, email, birthDate, location } = req.body
      const birthDateJsDate = moment(birthDate).format()
      console.log('moment date', birthDateJsDate)
      console.log('this2', this)
      
      const response = await user.create({ firstName, lastName, email, birthDate: birthDateJsDate, location })
      console.log('res', response)
      res.status(200).json({ ...response.dataValues })
      const birthdayCronJob = await Controller.setBirthDayCronJob(birthDateJsDate, location, response.dataValues.id)
      // setTimeout(() => {
      //   birthdayCronJob.stop()
      //   console.log('cronStop')
      // }, 15000)
    } catch (err) {
      console.log('err', err)
      res.status(500).json(err)
    }
  }

  static async setBirthDayCronJob (date, location, userId) {
    try {
      const month = moment(date).month()
      const day = moment(date).date()
      // const cronTime = `0 0 9 ${day} ${month} *`
      const cronTime = `0 41 0 ${day} ${month} *`
      // const cronTime = `*/10 * * * * *`
      console.log('cronTime', cronTime)
      const job = new CronJob(
        cronTime,
        async function () {
          const id = userId
          const birthDate = moment(date).format()
          const currLocation = location
          console.log('test cron job', id, birthDate, currLocation)
          try {
            const userRes = await user.findByPk(id)
            // console.log('res', userRes)
            if (userRes === null) {
              this.stop()
              console.log('stop cron data delete')
              return ''
            } else {
              const dataValues = userRes.dataValues ? userRes.dataValues : {}
              if (moment(dataValues.birthDate).format() !== birthDate || dataValues.location !== currLocation) {
                this.stop()
                console.log('stop cron data change')
                return ''
              } else {
                console.log('same data')
                await Controller.sendEmail(dataValues)
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

  static async sendEmail (dataValues) {
    const fullName = `${dataValues.firstName} ${dataValues.lastName}`
    const message = `Hey, ${fullName} it’s your birthday`

    try {
      const { data } = await axios.post('https://email-service.digitalenvision.com.au/send-email', { email: dataValues.email, message })
      console.log('dataAxios', data)
    } catch (err) {
      console.log('err', err)
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
  
      console.log('data', data)
  
      const response = await user.update(data, { where: { id }, returning: true })
      console.log('response', response)
      res.status(200).json(response)
      const dataValues = response[1][0].dataValues
      console.log('dataValues', dataValues)
      const birthDateJsDate = moment(dataValues.birthDate).format()

      if (isChangeDate) {
        if (moment(dataValues.birthDate).format() !== moment(oldDataValues.birthDate).format() || dataValues.location !== oldDataValues.location) {
          moment(dataValues.birthDate).format() !== birthDate || dataValues.location !== currLocation
          const birthdayCronJob = await Controller.setBirthDayCronJob(birthDateJsDate, dataValues.location, dataValues.id)
          setTimeout(() => {
            birthdayCronJob.stop()
            console.log('cronStop2')
          }, 130000)
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
      console.log('response', response)
      res.status(200).json({ msg: 'User Deleted' })
    } catch (err) {
      console.log('err', err)
      res.status(500).json(err)
    }
  }
}

module.exports = Controller;