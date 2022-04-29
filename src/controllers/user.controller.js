const db = require('../models/db.model')
const bcrypt = require('bcrypt')

class userController {

    // Login logic
    // Checks if user exist. If so: checks password validity
    async checkUser(req, res) {
        let sql = `SELECT * FROM users WHERE userName="${req.body.userName}"`
        console.log(req.body.userPassword)
        db.query(sql, function (err, results, fields) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            if (!results.length) {
                res.status(404).json({err: `User "${req.body.userName}" was not found!`})
                return
            }
            console.log(results, "before bcr")
            bcrypt.compare(req.body.userPassword, results[0].userPassword, function (err, same) {
                if (err){
                    res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                    return
                }
                if (same){
                    let id = results[0].id
                    res.status(200).json(id)
                }else{
                    res.status(401).json({err: 'Wrong password!'})
                }
            })
        })
    }


    // Registration logic
    // Checks if user ALREADY exist. If NOT so: adds user to the database
    // User gets redirected to dashboard!!!
    async addUser(req, res) {
        await bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            bcrypt.hash(req.body.userPassword, salt, function (err, hash) {
                if (err) {
                    res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                    return
                }
                let sql = `INSERT INTO users (userName, userPassword) VALUES ("${req.body.userName}", "${hash}")`
                db.query(sql, function (err, data) {
                    if (err) {
                        if (!err.fatal) {
                            switch (err.code) {
                                case "ER_DUP_ENTRY":
                                    res.status(400).json({err: `Name "${req.body.userName}" is already in use!`})
                                    return
                                // TODO???
                            }
                        } else {
                            res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                            return;
                        }
                    }
                    res.status(200).json(data.insertId)
                })
            })
        })
    }

}

module.exports = new userController()