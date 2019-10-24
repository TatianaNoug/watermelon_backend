const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var payinsRouter = express.Router();

app.use(bodyParser.urlencoded({extended: true}));

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "watermelon",
    port: "8889"
});
/****************************/
/********** PAYINS ***********/
/****************************/

payinsRouter.get('/payins', function (req, res) {
    let response = {"page": "wallets"};
    res.send(JSON.stringify(response));
});
