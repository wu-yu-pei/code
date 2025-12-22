const express = require('express')
const router = express.Router()
const rechargeController = require('../controllers/rechargeController.controller')

router.get('/', rechargeController.recharge)

module.exports = router
