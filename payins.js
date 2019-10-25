const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var payinsRouter = express.Router();

payinsRouter.use(bodyParser.urlencoded({extended: true}));


/****************************/
/********** PAYINS ***********/
/****************************/

payinsRouter.post('/', function (req, res) {
    let wallet_id = req.body.wallet_id;
    let amount = req.body.amount;

    const amountString = amount.toString();
    if(amountString.match(/^[0-9]+$/) != null){
        let selectWalletQuery = "SELECT * FROM wallets where id = ?";
        let query = "INSERT INTO payins (wallet_id, amount) VALUES (?, ?)";

        req.db.query(selectWalletQuery, [wallet_id], function (err, result, fields) {
            if(err) throw err;

            if(result.length>0){
                req.db.query(query, [result[0].id, amount], function (err2, result2, fields2) {
                    if(err2) throw err2;

                    if(result2.affectedRows>0){

                        var totalAmountString = amount.toString();
                        var first = totalAmountString.slice(0, (totalAmountString.length-2));
                        var sec = totalAmountString.slice((totalAmountString.length-2), totalAmountString.length);
                        var newTotalString = first + sec;
                        var newAmount = parseInt(newTotalString);

                        const payin = {
                            id : result2.insertId,
                            wallet_id : wallet_id,
                            amount : newAmount
                        }
                        res.status(200).json(payin);
                    }
                })
            }
        })

    }else{
        res.status(400).json({message: "Invalid amount format"});

    }
});

payinsRouter.get('/', function (req, res) {
    let query = `SELECT * FROM payins`;

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        if(result.length>0){
            const selectedPayins =[];
            for(var i = 0; i<result.length; i++) {
                const tempPayin ={
                    id:result[i].id,
                    wallet_id:result[i].wallet_id,
                    amount:result[i].amount
                }
                selectedPayins.push(tempPayin);
            };

            res.status(200).json(selectedPayins);
        }else{
            res.status(404).json({message: "No Payin found"});
        }

    });
});

payinsRouter.get('/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let query = `SELECT *  FROM payins WHERE id=${id}`;

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        if(result.length > 0){
            const selectedPayin ={
                id:result[0].id,
                wallet_id:result[0].wallet_id,
                amount:result[0].amount
            }
            res.status(200).json(selectedPayin);
        }else{
            res.status(404).json({message: "Payin not found"});
        }

    });
});
module.exports = payinsRouter;