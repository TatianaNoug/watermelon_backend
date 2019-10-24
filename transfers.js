const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var transfersRouter = express.Router();

transfersRouter.use(bodyParser.urlencoded({extended: true}));

/****************************/
/********** TRANSFERS ***********/
/****************************/

transfersRouter.get('/transfers', function (req, res) {
    let response = {"page": "wallets"};
    res.send(JSON.stringify(response));
});
