const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")


router
    .get('/', function (req, res) {
    res.status(200).render("registration")
})
    .post('/', userController.addUser)

module.exports = router;
