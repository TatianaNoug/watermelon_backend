const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var cardsRouter = express.Router();
app.use(bodyParser.urlencoded({extended: true}));

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "watermelon",
    port: "8889"
});

/****************************/
/********** CARDS ***********/
/****************************/

cardsRouter.post('/cards', function (req, res) {
    let user_id = req.body.user_id;
    let last_4 = req.body.last_4;
    let brand = req.body.brand;
    let expired_at = req.body.expired_at;

    let query = `INSERT INTO cards (user_id, last_4, brand, expired_at) VALUES ('${user_id}', '${last_4}', '${brand}', '${expired_at}')`;

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    })
});

cardsRouter.get('/cards', function (req, res) {
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

cardsRouter.put('/cards/:id(\\d+)', function (req, res) {
    let id = req.params.id;
    let user_id = req.body.user_id;
    let last_4 = req.body.last_4;
    let brand = req.body.brand;
    let expired_at = req.body.expired_at;

    let query = ` UPDATE cards SET user_id = '${user_id}',  last_4 = '${last_4}', brand = '${brand}', expired_at = '${expired_at}' WHERE id=${id}`;

    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    })
});

cardsRouter.delete('/cards/:id(\\d+)', function (req, res) {
    let id = req.params.id;
    let query = `DELETE FROM cards WHERE id=${id}`;
    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    })
});
