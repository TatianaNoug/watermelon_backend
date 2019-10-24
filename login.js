const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');

var loginRouter = express.Router();
loginRouter.use(bodyParser.urlencoded({extended: true}));


let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "watermelon",
    port: "8889"
});

loginRouter.post('/', function (req, res) {
   let email = req.body.email;
   let password = req.body.password;

   let query = `SELECT api_key FROM users WHERE email='${email}' AND password='${password}'`;

   db.query(query, function (err, result, fields) {
       if(err) throw err;

       const login = {
           access_token:result[0].api_key
       };

       res.status(200).json(login);
   })
});

module.exports = loginRouter;