const db = require('../models/db.model')
const fs = require('fs')

class bankController {

    async updateBank(req, res, next) {
        if (req.cookies.id != req.body.Users_id) { // небезпечно але sql цікаво визначає типи даних TODO??
            res.status(403).json({err: 'Access denied. Are you authorized?'})
            return
        }
        let sql = `
            update banks
            set bankName="${req.body.bankName}",
            bankInterest=${req.body.bankInterest},
            bankMDP=${req.body.bankMDP},
            bankMaxLoan=${req.body.bankMaxLoan},
            bankLoanTerm=${req.body.bankLoanTerm}
            where banks.id =${req.body.id};
        `
        db.query(sql, function (err, results, fields) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                console.log(err)
                return
            }
            res.status(200).end()
        })
    }

    async deleteBank(req, res, next) {
        console.log(typeof req.cookies.id,typeof req.body.Users_id)
        if (req.cookies.id !== req.body.Users_id) {
            res.status(403).json({err: 'Access denied. Are you authorized?'})
            return
        }
        let sql = `
            delete from banks where id = ${req.body.id}
        `
        db.query(sql, function (err, results, fields) {
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            res.status(200).end()
        })
    }

    async addBank(req, res, next) {
        if (!req.cookies.id) {
            res.status(401).json({err: 'Access denied. Are you authorized?'})
            return
        }

        let userId = req.cookies.id

        let sql = `
            insert into banks (bankName, bankInterest, bankMDP, bankMaxLoan, bankLoanTerm, Users_id) values
            ("${req.body.bankName}",
            ${req.body.bankInterest},
            ${req.body.bankMDP},
            ${req.body.bankMaxLoan},
            ${req.body.bankLoanTerm},
            ${userId}
            );
        `

        db.query(sql, function (err, results, fields) {
            console.log(err)
            if (err) {
                res.status(409).json({err: 'Unexpected server error. Sorry, try later!'})
                return
            }
            let bank = req.body
            bank.id = results.insertId
            bank.Users_id = userId
            res.status(200).json(bank)
            if (res.fromfile){

                delete res.fromfile
            }
        })
    }

    async buildBankFromFile(req, res, next) {
        if (!req.cookies.id) {
            res.status(403).json({err: 'Access denied. Are you authorized?'})
            return
        }
        fs.readFile(req.files.file.path, "utf-8", (err, data) => {
            try {
                if (err) {
                    res.status(401).json({err: "File not supported!"})
                    return
                }
                let str = String(data)
                let bank = JSON.parse(unshuffle(str))
                res.fromfile = 1
                req.body = bank
                next()
            } catch (e) {
                res.status(401).json({err: "File not supported!"})
                console.log(e)
            }
        })
    }
}

function unshuffle(str) {
    let parts = str.split('№%@&$')
    let arr = JSON.parse(parts[0])
    let a = parts[1].split(""),
        n = a.length;

    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(arr[i] * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

module.exports = new bankController()