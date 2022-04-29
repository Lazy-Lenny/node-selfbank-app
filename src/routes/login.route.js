const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")

router
    .get('/', function (req, res){
    res.status(200).render('login')
})
    .post('/', userController.checkUser)

module.exports = router;

