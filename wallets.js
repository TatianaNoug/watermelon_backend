const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var walletsRouter = express.Router();

walletsRouter.use(bodyParser.urlencoded({extended: true}));


/****************************/
/********** WALLETS ***********/
/****************************/

walletsRouter.get('/', function (req, res) {

    let id;
   // if("x-auth-token" in req.headers){
     //   id = req.headers["x-auth-token"];
    //}else{
        id = req.user.wallet_id;
    //}
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

                 let totalAmountString = totalAmount.toString();
                 let first = totalAmountString.slice(0, (totalAmountString.length-2));
                 let sec = totalAmountString.slice((totalAmountString.length-2), totalAmountString.length);
                 let newTotalString = first + sec;
                 totalAmount = parseInt(newTotalString);

                 const tempWallet = {
                     wallet_id: id,
                     balance: totalAmount
                 }
                 walletSelected.push(tempWallet);
                 res.status(200).json(walletSelected);
             });
         });
     });


});

module.exports = walletsRouter;