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
            let creditedWalletQuery = "SELECT * FROM wallets WHERE id=?";
            let insertTransferQuery = "INSERT INTO transfers(debited_wallet_id,credited_wallet_id, amount) VALUES (?, ?, ?)  "

            req.db.query(creditedWalletQuery, [credited_wallet_id], function (err, result, fields) {
                if(err) throw err;

                console.log(credited_wallet_id);
                console.log(debited_wallet_id);
                console.log(result.length);

                if(result.length > 0){
                    req.db.query(insertTransferQuery, [debited_wallet_id, credited_wallet_id, amount], function (err2, result2, fields2) {
                        if(err2) throw err2;

                        console.log("in query");
                        console.log(result2.affectedRows);
                        if(result2.affectedRows>0){
                            const insertedTransfer = {
                                id : result2.insertId,
                                wallet_id : credited_wallet_id,
                                amount : amount,
                            };

                            res.status(200).json(insertedTransfer);
                        }
                    });
                }else{
                    console.log("in not found");
                    res.status(400).json({message : "User not found "})
                }
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