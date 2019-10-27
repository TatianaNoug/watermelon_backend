const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

var users = require('./bonusUser');
var login = require('./bonusLogin');
var wallets = require('./bonusWallet');
var payins = require('./bonusPayin');
var payouts = require('./bonusPayout');

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "watermelon",
    port: "8889"
});

app.use(function (req, res, next) {
    req.db = db;
    next();
})
app.use(bodyParser.urlencoded({extended: true}));

app.use('/v1/users', users);
app.use('/v1/login', login);
app.use(function (req, res, next) {
    if("x-auth-token" in req.headers){
        let access_token = req.headers["x-auth-token"];
        let query = `SELECT users.id, users.email, users.is_admin, wallets.id as wallet_id FROM users JOIN wallets on users.id = wallets.user_id WHERE api_key = '${access_token}'`;

        req.db.query(query, function (err, result, fields) {
            if(err) throw err;
            if(result.length > 0){
                req.user = {
                    id: result[0].id,
                    email: result[0].email,
                    is_admin: false,
                    wallet_id: result[0].wallet_id
                };
                next();
            }else{
                res.status(401).send();
            }
        });
    }else{
        res.status(401).send();
    }
});

app.use('/v1/wallets', wallets);
app.use('/v1/payins', payins);
app.use('/v1/payouts', payouts);



app.listen(8000, function () {
    console.log("Watermelon app listening on port 8000");
});

