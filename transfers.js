const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var transfersRouter = express.Router();

transfersRouter.use(bodyParser.urlencoded({extended: true}));

/****************************/
/********** TRANSFERS ***********/
/****************************/
transfersRouter.post('/', function (req, res) {

    let credited_wallet_id = req.body.credited_wallet_id;
    let debited_wallet_id = req.user.wallet_id;
    let amount = req.body.amount;

    if(credited_wallet_id == debited_wallet_id){
        res.status(400).json({message:"Cannot create a transfer to oneself"});

    }else{
        var amountString = amount.toString();
        if(amountString.match(/^[0-9]+$/) != null){
            let payinAmount = 0;
            let payoutAmout = 0;
            let debitedAmount = 0;
            let creditedAmount = 0;

            let queryPayins = "SELECT amount FROM payins WHERE wallet_id=?";
            let queryPayouts = "SELECT amount  FROM payouts WHERE wallet_id=?";
            let queryTransfers = "SELECT debited_wallet_id, credited_wallet_id, amount FROM transfers";

            req.db.query(queryPayins, [debited_wallet_id], function (err2, result2, fields2) {
                if (err2) throw err2;

                if (result2.length > 0) {
                    for (let i = 0; i < result2.length; i++) {
                        payinAmount += result2[i].amount;
                    }
                }


                req.db.query(queryPayouts, [debited_wallet_id], function (err3, result3, fields3) {
                    if (err3) throw err3;

                    if (result3.length > 0) {
                        for (let i = 0; i < result3.length; i++) {
                            payoutAmout += result3[i].amount;
                        }
                    }


                    req.db.query(queryTransfers, function (err4, result4, fields4) {
                        if (err4) throw err4;

                        if (result4.length > 0) {
                            for (let i = 0; i < result4.length; i++) {
                                if (result4[i].debited_wallet_id === debited_wallet_id) {
                                    debitedAmount += result4[i].amount;
                                } else if (result4[i].credited_wallet_id === debited_wallet_id) {
                                    creditedAmount += result4[i].amount;
                                }
                            }
                        }
                        let totalAmount = creditedAmount + payinAmount - debitedAmount - payoutAmout;

                        if (Number(totalAmount) >= Number(amount)) {

                            let creditedWalletQuery = "SELECT * FROM wallets WHERE id=?";
                            let insertTransferQuery = "INSERT INTO transfers(debited_wallet_id,credited_wallet_id, amount) VALUES (?, ?, ?)  "

                            req.db.query(creditedWalletQuery, [credited_wallet_id], function (err, result, fields) {
                                if (err) throw err;

                                if (result.length > 0) {
                                    req.db.query(insertTransferQuery, [debited_wallet_id, credited_wallet_id, amount], function (err2, result2, fields2) {
                                        if (err2) throw err2;

                                        if (result2.affectedRows > 0) {
                                            const insertedTransfer = {
                                                id: result2.insertId,
                                                wallet_id: credited_wallet_id,
                                                amount: Number(amount)
                                            };

                                            res.status(200).json(insertedTransfer);
                                        }
                                    });
                                }else{
                                res.status(400).json({message : "User not found "})
                            }
                            });
                        } else {
                            res.status(400).json({message: "Invalid Amount"});
                        }
                    });
                });
            });
        }else{
            res.status(400).json({message:"Invalid Amount Format"});
        }
    }
});

transfersRouter.get('/', function (req, res) {
    let query = `SELECT * FROM transfers`;

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        if(result.length>0){
            const selectedTransfers =[];
            for(var i = 0; i<result.length; i++) {
                const tempTransfer ={
                    id:result[i].id,
                    debited_wallet_id:result[i].debited_wallet_id,
                    credited_wallet_id:result[i].credited_wallet_id,
                    amount:result[i].amount
                }
                selectedTransfers.push(tempTransfer);
            };

            res.status(200).json(selectedTransfers);
        }else{
            res.status(404).json({message: "No Transfer found"});
        }

    });
});

transfersRouter.get('/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let query = `SELECT *  FROM transfers WHERE id=${id}`;

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        if(result.length > 0){
            const selectedTransfer ={
                id:result[0].id,
                debited_wallet_id:result[i].debited_wallet_id,
                credited_wallet_id:result[i].credited_wallet_id,
                amount:result[0].amount
            }
            res.status(200).json(selectedTransfer);
        }else{
            res.status(404).json({message: "Transfer not found"});
        }

    });
});

module.exports= transfersRouter;