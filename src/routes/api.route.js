const express = require('express')
const router = express.Router()
const controller = require("../controllers/api.controller")

router.get('/', function (req, res) {
    res.status(200).json('Welcome to SelfBank api!')
})

router.get('/users', controller.getUsers)
router.get('/users/id/:userId', controller.getUserById)
router.get('/users/name/:userName', controller.getUserByName)

router.get('/banks', controller.getBanks)
router.get('/banks/id/:bankId', controller.getBankById)
router.get('/banks/name/:bankName', controller.getBanksByName)
router.get('/banks/userid/:userId', controller.getBanksByUserId)

module.exports = router;
