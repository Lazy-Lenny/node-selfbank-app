var express = require('express');
var router = express.Router();

/* GET home page. */
router
    .get('/', function (req, res, next) {
        if (req.cookies.id){
            res.status(301).redirect('/dashboard#banks')
        }
        res.status(301).redirect('/login')
    })

module.exports = router;
