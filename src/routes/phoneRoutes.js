const express = require('express')
const router = express.Router()
const phoneController = require('../controllers/phone.controller')

router.get('/', phoneController.list)
router.get('/get', phoneController.get)
router.get('/block', phoneController.block)

module.exports = router
