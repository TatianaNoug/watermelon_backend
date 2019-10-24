const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');

var loginRouter = express.Router();
loginRouter.use(bodyParser.urlencoded({extended: true}));


loginRouter.post('/', function (req, res) {
   let email = req.body.email;
   let password = req.body.password;

   if(email.length > 0 && password.length > 0){
       let query = `SELECT api_key FROM users WHERE email='${email}' AND password='${password}'`;

       req.db.query(query, function (err, result, fields) {
           if(err) throw err;
           if(result.length > 0){
               const login = {
                   access_token:result[0].api_key,
               };
               res.status(200).json(login);
           }else{
               res.status(401).send();
           }

       })
   }else{
        res.status(400).send();
   }

});

module.exports = loginRouter;