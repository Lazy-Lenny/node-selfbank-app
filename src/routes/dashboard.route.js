const express = require("express")
const router = express.Router()
const bankController = require('../controllers/bank.controller')

router
    .get('/', function (req, res) {res.status(200).render('dashboard.ejs')})
    .post('/', bankController.addBank)
    .put('/', bankController.updateBank)
    .delete('/', bankController.deleteBank)
    .post('/fromfile', [bankController.buildBankFromFile, bankController.addBank])

module.exports = router