const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var cardsRouter = express.Router();

cardsRouter.use(bodyParser.urlencoded({extended: true}));


/****************************/
/********** WALLETS ***********/
/****************************/

cardsRouter.get('/wallets', function (req, res) {
    let response = {"page": "wallets"};
    res.send(JSON.stringify(response));
});
