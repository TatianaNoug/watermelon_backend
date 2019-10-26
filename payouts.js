const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var payoutsRouter = express.Router();

payoutsRouter.use(bodyParser.urlencoded({extended: true}));


/****************************/
/********** PAYOUTS ***********/
/****************************/

payoutsRouter.post('/', function (req, res) {
    let wallet_id = req.body.wallet_id;
    let amount = req.body.amount;

    var amountString = amount.toString();
    if(amountString.match(/^[0-9]+$/) != null){
        console.log("in");
        let selectWalletQuery = "SELECT * FROM wallets where id = ?";
        let insertQuery = "INSERT INTO payouts (wallet_id, amount) VALUES (?, ?)";

        req.db.query(selectWalletQuery, [wallet_id], function (err, result, fields) {
            if(err) throw err;
            console.log(result.length);
            if(result.length>0){
                req.db.query(insertQuery, [result[0].id, amount], function (err2, result2, fields2) {
                    if(err2) throw err2;

                    console.log(result2.affectedRows);
                    if(result2.affectedRows>0){

                        var totalAmountString = amount.toString();
                        var first = totalAmountString.slice(0, (totalAmountString.length-2));
                        var sec = totalAmountString.slice((totalAmountString.length-2), totalAmountString.length);
                        var newTotalString = first + sec;
                        var newAmount = parseInt(newTotalString);

                        const payout = {
                            id : result2.insertId,
                            wallet_id : wallet_id,
                            amount : newAmount
                        }
                        res.status(200).json(payout);
                    }
                })
            }
        })

    }else{
        res.status(400).json({message: "Invalid amount format"});

    }
});
payoutsRouter.get('/', function (req, res) {
    let query = `SELECT * FROM payouts`;

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        if(result.length>0){
            const selectedPayout =[];
            for(var i = 0; i<result.length; i++) {
                const tempPayout ={
                    id:result[i].id,
                    wallet_id:result[i].wallet_id,
                    amount:result[i].amount
                }
                selectedPayout.push(tempPayout);
            };

            res.status(200).json(selectedPayout);
        }else{
            res.status(404).json({message: "No Payout found"});
        }

    });
});

payoutsRouter.get('/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let query = `SELECT *  FROM payouts WHERE id=${id}`;

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        if(result.length > 0){
            const selectedPayout ={
                id:result[0].id,
                wallet_id:result[0].wallet_id,
                amount:result[0].amount
            }
            res.status(200).json(selectedPayout);
        }else{
            res.status(404).json({message: "Payout not found"});
        }

    });
});
module.exports = payoutsRouter;