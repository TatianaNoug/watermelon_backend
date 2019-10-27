const express = require('express');
const bodyParser = require('body-parser');
let payoutsRouter = express.Router();

payoutsRouter.use(bodyParser.urlencoded({extended: true}));

/****************************/
/********** PAYOUTS ***********/
/****************************/

payoutsRouter.post('/', function (req, res) {
    let wallet_id = req.body.wallet_id;
    let amount = req.body.amount;

    let amountString = amount.toString();
    if(amountString.match(/^[0-9]+$/) != null){

        let payinAmount = 0;
        let payoutAmout = 0;
        let debitedAmount = 0;
        let creditedAmount = 0;

        let queryPayins = "SELECT amount FROM payins WHERE wallet_id=?";
        let queryPayouts = "SELECT amount  FROM payouts WHERE wallet_id=?";
        let queryTransfers = "SELECT debited_wallet_id, credited_wallet_id, amount FROM transfers";

        req.db.query(queryPayins, [wallet_id], function (err2, result2, fields2) {
            if (err2) throw err2;

            if (result2.length > 0) {
                for (let i = 0; i < result2.length; i++) {
                    payinAmount += result2[i].amount;
                }
            }


            req.db.query(queryPayouts, [wallet_id], function (err3, result3, fields3) {
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
                            if (result4[i].debited_wallet_id === wallet_id) {
                                debitedAmount += result4[i].amount;
                            } else if (result4[i].credited_wallet_id === wallet_id) {
                                creditedAmount += result4[i].amount;
                            }
                        }
                    }
                    let totalAmount = creditedAmount + payinAmount - debitedAmount - payoutAmout;

                    if (Number(totalAmount) >= Number(amount)) {
                        let selectWalletQuery = "SELECT * FROM wallets where id = ?";
                        let insertQuery = "INSERT INTO payouts (wallet_id, amount) VALUES (?, ?)";

                        req.db.query(selectWalletQuery, [wallet_id], function (err, result, fields) {
                            if (err) throw err;

                            if (result.length > 0) {

                                req.db.query(insertQuery, [result[0].id, amount], function (err5, result5, fields5) {
                                    if (err5) throw err5;

                                    if (result5.affectedRows > 0) {

                                        const payout = {
                                            id: result5.insertId,
                                            wallet_id: wallet_id,
                                            amount: Number(amount)
                                        }
                                        res.status(200).json(payout);
                                    }
                                });
                            }
                        });
                    } else {
                        res.status(400).json({message : "Invalid Amount"});
                    }
                });
            });
        });
    }else{
        res.status(400).json({message: "Invalid amount format"});

    }
});

payoutsRouter.get('/', function (req, res) {
    let query = "SELECT * FROM payouts";

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        if(result.length>0){
            const selectedPayout =[];
            for(let i = 0; i<result.length; i++) {
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

    let query = "SELECT *  FROM payouts WHERE id=?";

    req.db.query(query,[id], function (err, result, fields) {
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

/****************************/
/********** BONUS ***********/
/****************************/

payoutRouter.put('/:id(\\d+)', function (req, res) {
    res.status(404).json({message : "Wallet Not found"});
});

payoutRouter.delete('/:id(\\d+)', function (req, res) {
    res.status(404).json({message : "Wallet Not found"});
});

module.exports = payoutRouter;