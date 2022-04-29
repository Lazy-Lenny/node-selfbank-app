const db = require('../models/db.model')

class ApiController {

    // get ALL users
    async getUsers(req, res) {
        let sql = `SELECT id, userName FROM users`
        db.query(sql, function (err, results, fields) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            res.json(results)
        })
    }

    // get ALL banks
    async getBanks(req, res) {
        let sql = `SELECT * FROM banks`
        db.query(sql, function (err, results, fields) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            res.json(results)
        })

    }

    // get user by user's ID
    async getUserById(req, res) {
        let sql = `
                    select users.id, users.userName, banks.* from users join banks on users.id = banks.Users_id where users.id = ${req.params.userId}
                  `
        db.query(sql, function (err, results_diff, fields) {
            if (err) {
                console.log(err)
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            let results = {
                id: 0,
                userName: '',
                banks: []
            }
            results_diff.map((value, index) => {
                if (index===0){
                    results.id = value.id
                    results.userName = value.userName
                }
                delete value.id
                delete value.userName
                results.banks.push(value)
            })
            res.json(results)
        })
    }

    // get user by user's NAME
    async getUserByName(req, res) {
        let sql = `
                    select users.id, users.userName, banks.* from users join banks on users.id = banks.Users_id where userName = "${req.params.userName}"
                  `
        db.query(sql, function (err, results_diff, fields) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            let results = {
                id: 0,
                userName: '',
                banks: []
            }
            results_diff.map((value, index) => {
                if (index===0){
                    results.id = value.id
                    results.userName = value.userName
                }
                delete value.id
                delete value.userName
                results.banks.push(value)
            })
            res.json(results)
        })
    }

    // get ALL banks which use same user ID
    async getBanksByUserId(req, res, next) {
        let sql = `SELECT * FROM banks WHERE Users_id=${req.params.userId}`
        db.query(sql, function (err, results, fields) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            res.json(results)
        })
    }

    // get bank by bank's ID
    async getBankById(req, res, next) {
        let sql = `SELECT * FROM banks WHERE id=${req.params.bankId}`
        db.query(sql, function (err, results, fields) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            res.json(results)
        })
    }

    // get ALL banks which use same NAME
    async getBanksByName(req, res, next) {
        let sql = `SELECT * FROM banks WHERE bankName="${req.params.bankName}"`
        db.query(sql, function (err, results, fields) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            res.json(results)
        })
    }

}

module.exports = new ApiController()