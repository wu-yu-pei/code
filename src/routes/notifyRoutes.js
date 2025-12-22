const express = require('express')
const router = express.Router()
const notifyController = require('../controllers/notify')

router.get('/', notifyController.notify)

module.exports = router
