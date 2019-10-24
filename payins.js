const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var payinsRouter = express.Router();

payinsRouter.use(bodyParser.urlencoded({extended: true}));


/****************************/
/********** PAYINS ***********/
/****************************/

payinsRouter.get('/payins', function (req, res) {
    let response = {"page": "wallets"};
    res.send(JSON.stringify(response));
});
