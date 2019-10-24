const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var payoutsRouter = express.Router();

payoutsRouter.use(bodyParser.urlencoded({extended: true}));


/****************************/
/********** PAYOUTS ***********/
/****************************/

payoutsRouter.get('/payouts', function (req, res) {
    let response = {"page": "wallets"};
    res.send(JSON.stringify(response));
});
