const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({extended: true}));


/**   depot git = watermelon_backend **************************/
/********** USERS ***********/
/****************************/

app.post('/users', function (req, res) {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    let is_admin = req.body.is_admin;
    let access_token = req.body.api_key;

    let query = `INSERT INTO users (first_name, last_name, email, password, is_admin, api_key) VALUES ('${first_name}', '${last_name}', '${email}', '${password}', '${is_admin}', '${access_token}')`;

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json("first name : "+first_name + "  " + "last name : "+ last_name + "  " +"email : "+ email +"  "+"is admin : " +is_admin + "  " + " access_token : " + access_token+ "  ");
    })

    let id = `SELECT id FROM users WHERE first_name=${first_name} AND last_name=${last_name} AND email=${email}`;
    query  = `INSERT INTO wallets (user_id) VALUES '${id}'`;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success wallet"));
    })
});

app.get('/users', function (req, res) {

    let query = `SELECT id,first_name, last_name, email FROM users`;
    db.query(query, function (err, result, fields) {
        if (err) throw err;


        res.status(200).json(result);
    });
});

app.get('/users/:id(\\d+)', function (req, res) {
    let id = req.params.id;


    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let is_admin = req.body.is_admin;

    let query = `SELECT first_name, last_name, email, is_admin FROM users WHERE id=${id}`;

    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.status(200).json(result);//"first name : "+first_name + "  " + "last name : "+ last_name + "  " +"email : "+ email +"  "+"is admin : " +is_admin + "  ");
    });
});

app.put('/users/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    let is_admin = req.body.is_admin;

    let query = ` UPDATE users SET first_name = '${first_name}',  last_name = '${last_name}', email = '${email}', password = '${password}', is_admin = '${is_admin}' WHERE id=${id}`;

    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.status(200).json("first name : "+first_name + "  " + "last name : "+ last_name + "  " +"email : "+ email +"  "+"is admin : " +is_admin + "  ");
    })
});

app.delete('/users/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let query = `DELETE FROM users WHERE id=${id}`;

    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.status(204).json("SUCCESS DELETING USER ");
        //+ first_name  + "  " +last_name + "  " +"email : "+ email +" ");
    })
});
