const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

var users = require('./users');
var login = require('./login');
var cards = require('./cards');

var wallets = require('./wallets');
var payins = require('./payins');
var payouts = require('./payouts');
var transfers = require('./transfers');

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "watermelon",
    port: "8889"
});

app.use(function (req, res, next) {
    req.db =db;
    next();
})

app.use('/v1/users',users);
app.use('/v1/login', login);
app.use('/v1/cards', cards);
//app.use(wallets);
//app.use(payins);
//app.use(payouts);
//app.use(transfers);

app.use(bodyParser.urlencoded({extended: true}));


app.listen(8000, function () {
    console.log("Watermelon app listening on port 8000");
});

