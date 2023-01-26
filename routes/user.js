const express = require('express')
const router = express.Router()
const Controller = require('../controller/userController')

router.get('/getAllUser')
router.post('/addUser', Controller.addUser)
router.put('/editUser/:id', Controller.updateUser)
router.delete('/deleteUser/:id', Controller.deleteUser)

module.exports = router;
