const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var walletRouter = express.Router();

walletRouter.use(bodyParser.urlencoded({extended: true}));

/****************************/
/********** WALLETS ***********/
/****************************/

walletsRouter.get('/', function (req, res) {

    let id = req.user.wallet_id;

    let payinAmount = 0;
    let payoutAmout = 0;
    let debitedAmount = 0;
    let creditedAmount = 0;

    const walletSelected = [];

    let queryPayins = "SELECT amount FROM payins WHERE wallet_id=?";
    let queryPayouts = "SELECT amount  FROM payouts WHERE wallet_id=?";
    let queryTransfers = "SELECT debited_wallet_id, credited_wallet_id, amount FROM transfers";

    req.db.query(queryPayins, [id], function (err2, result2, fields2) {
        if (err2) throw err2;
        if (result2.length > 0) {
            for (let i = 0; i < result2.length; i++) {
                payinAmount += result2[i].amount;
            }
        }


        req.db.query(queryPayouts, [id], function (err3, result3, fields3) {
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
                        if (result4[i].debited_wallet_id === id) {
                            debitedAmount += result4[i].amount;
                        } else if (result4[i].credited_wallet_id === id) {
                            creditedAmount += result4[i].amount;
                        }
                    }
                }
                let totalAmount = creditedAmount + payinAmount - debitedAmount - payoutAmout;

                const tempWallet = {
                    wallet_id: id,
                    balance: Number(totalAmount)
                }
                walletSelected.push(tempWallet);
                res.status(200).json(walletSelected);
            });
        });
    });


});

walletsRouter.get('/:id(\\d+)', function (req, res) {

    let id = req.params.id;

    let payinAmount = 0;
    let payoutAmout = 0;
    let debitedAmount = 0;
    let creditedAmount = 0;

    let query = "SELECT * FROM wallets WHERE id=?";
    let queryPayins = "SELECT amount FROM payins WHERE wallet_id=?";
    let queryPayouts = "SELECT amount  FROM payouts WHERE wallet_id=?";
    let queryTransfers = "SELECT debited_wallet_id, credited_wallet_id, amount FROM transfers";

    req.db.query(query, [id], function (err, result, fields) {
        if(err) throw err;
        if(result.length > 0){

            req.db.query(queryPayins, [id], function (err2, result2, fields2) {
                if (err2) throw err2;
                if (result2.length > 0) {
                    for (let i = 0; i < result2.length; i++) {
                        payinAmount += result2[i].amount;
                    }
                }

                req.db.query(queryPayouts, [id], function (err3, result3, fields3) {
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
                                if (result4[i].debited_wallet_id == id) {
                                    debitedAmount += result4[i].amount;
                                } else if (result4[i].credited_wallet_id == id) {
                                    creditedAmount += result4[i].amount;
                                }
                            }
                        }
                        let totalAmount = creditedAmount + payinAmount - debitedAmount - payoutAmout;

                        const selectedWallet = {
                            wallet_id: id,
                            balance: Number(totalAmount)
                        }

                        res.status(200).json(selectedWallet);
                    });
                });
            });
        }else{
            res.status(404).json({message : "Wallet not found"});
        }
    });
});

/****************************/
/********** BONUS ***********/
/****************************/

walletRouter.put('/:id(\\d+)', function (req, res) {
   res.status(404).json({message : "Wallet Not found"});
});

walletRouter.delete('/:id(\\d+)', function (req, res) {
    res.status(404).json({message : "Wallet Not found"});
});

module.exports = walletRouter;