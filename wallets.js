const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var walletsRouter = express.Router();

walletsRouter.use(bodyParser.urlencoded({extended: true}));


/****************************/
/********** WALLETS ***********/
/****************************/

walletsRouter.get('/', function (req, res) {

    let queryWallet = "SELECT id FROM wallets";
    let queryPayins = "SELECT amount as payinsAmount FROM payins WHERE wallet_id=?";
    let queryPayouts = "SELECT amount as payoutsAmount FROM payouts WHERE wallet_id=?";
    let queryTransfers = "SELECT debited_wallet_id, credited_wallet_id, amount as transfersAmount FROM transfers";


    req.db.query(queryWallet, function (err, result, fields) {
        if(err) throw err;

        if(result.length > 0){
            const walletSelected = [];

            for(var j = 0; j<result.length; j++) {
                var id = result[j].id;
                var payinAmount = 0;
                var payoutAmout = 0;
                var debitedAmount = 0;
                var creditedAmount = 0;

                req.db.query(queryPayins, [id], function (err2, result2, fields2) {
                    if (err2) throw err2;
                    if (result2.length > 0) {
                        for (var i = 0; i < result2.length; i++) {
                            payinAmount += result2[i].amount;
                        }
                    }

                    req.db.query(queryPayouts, [id], function (err3, result3, fields3) {
                        if (err3) throw err3;
                        if (result3.length > 0) {
                            for (var i = 0; i < result3.length; i++) {
                                payoutAmout += result3[i].amount;
                            }
                        }

                        req.db.query(queryTransfers, function (err4, result4, fields4) {
                            if (err4) throw err4;
                            if (result4.length > 0) {
                                for (var i = 0; i < result4.length; i++) {
                                    if (result4[i].debited_wallet_id === result[0].id) {
                                        debitedAmount += result4[i].amount;
                                    } else if (result4[i].credited_wawllet_id === result[0].id) {
                                        creditedAmount += result4[i].amount;
                                    }
                                }
                            }

                            var totalAmount = creditedAmount + payinAmount - debitedAmount - payoutAmout;

                            var totalAmountString = totalAmount.toString();
                            var first = totalAmountString.slice(0, (totalAmountString.length-2));
                            var sec = totalAmountString.slice((totalAmountString.length-2), totalAmountString.length);
                            var newTotalString = first + sec;
                            totalAmount = parseInt(newTotalString);

                            const tempWallet = {
                                wallet_id: id,
                                balance: totalAmount
                            }
                            walletSelected.push(tempWallet);
                            res.status(200).json(walletSelected);
                        })
                    })
                })
            }
            }
        })

});

module.exports = walletsRouter;