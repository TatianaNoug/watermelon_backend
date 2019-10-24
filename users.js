const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const hat = require('hat');
const jwt = require('jsonwebtoken');
const fs = require('fs');

var userRouter = express.Router();
userRouter.use(bodyParser.urlencoded({extended: true}));

/**   depot git = watermelon_backend **************************/
/********** USERS ***********/
/****************************/

userRouter.post('/', function (req, res) {

        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let password = req.body.password;
        let is_admin = 0;
        let api_key = "patate8";//hat.rack(64, 2);

        let query = `INSERT INTO users (first_name, last_name, email, password, is_admin, api_key) VALUES ('${first_name}', '${last_name}', '${email}', '${password}', '${is_admin}', '${api_key}')`;

        req.db.query(query, function (err, result, fields) {
            if (err) throw err;

            const newUser = {
                id:result.insertId,
                access_token:api_key,
                first_name:req.body.first_name,
                last_name:req.body.last_name,
                email:req.body.email,
                is_admin:false
            };
            res.status(200).json(newUser);


        })

});

userRouter.use(function (req, res, next) {
    if("x-auth-token" in req.headers){
        let access_token = req.headers["x-auth-token"];
        let query = `SELECT * FROM users WHERE api_key = '${access_token}'`;
        req.db.query(query, function (err, result, fields) {
            if(err) throw err;
            if(result.length > 0){
                console.log("in next");
                next();
            }else{
                res.status(401).send();
            }
        });
    }else{
        res.status(401).send();
    }
});

userRouter.get('/', function (req, res) {

    console.log("in get");
    let query = `SELECT id,first_name, last_name, email FROM users`;
    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        const selectedUsers =[];
        for(var i = 0; i<result.length; i++) {
            const tempUser ={
                id:result[i].id,
                first_name:result[i].first_name,
                last_name:result[i].last_name,
                email:result[i].email,
                is_admin:false
            }
            selectedUsers.push(tempUser);
        };

        res.status(200).json(selectedUsers);
    });
});

userRouter.get('/:id(\\d+)', function (req, res) {
    let id = req.params.id;


    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let is_admin = req.body.is_admin;

    let query = `SELECT first_name, last_name, email, is_admin FROM users WHERE id=${id}`;

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.status(200).json(result);//"first name : "+first_name + "  " + "last name : "+ last_name + "  " +"email : "+ email +"  "+"is admin : " +is_admin + "  ");
    });
});

userRouter.put('/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    let is_admin = req.body.is_admin;

    let query = ` UPDATE users SET first_name = '${first_name}',  last_name = '${last_name}', email = '${email}', password = '${password}', is_admin = '${is_admin}' WHERE id=${id}`;

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.status(200).json("first name : "+first_name + "  " + "last name : "+ last_name + "  " +"email : "+ email +"  "+"is admin : " +is_admin + "  ");
    })
});

userRouter.delete('/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let query = `DELETE FROM users WHERE id=${id}`;

    req.db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.status(204).json("SUCCESS DELETING USER ");
        //+ first_name  + "  " +last_name + "  " +"email : "+ email +" ");
    })
});

module.exports = userRouter;

