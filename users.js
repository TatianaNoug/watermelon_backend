const express = require('express');
const bodyParser = require('body-parser');
const hat = require('hat');

let userRouter = express.Router();

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
        let api_key = hat();

    if(first_name === undefined || last_name === undefined || email === undefined || password === undefined){
        res.status(400).json({message : "Missing fields"});
    }else {
        if(email.toString().indexOf("@")>0){
            let verifyEmailQuery = "SELECT * FROM users WHERE email=?";
            req.db.query(verifyEmailQuery, [email], function (err0, result0, fields0) {
               if(err0) throw err0;

               if(result0.length > 0){
                   res.status(400).json({message : "Email Address Already Exists"});
               }else{
                   let query = "INSERT INTO users (first_name, last_name, email, password, is_admin, api_key) VALUES (?, ?, ?, ?,?, ?)";
                   let query2 = "INSERT INTO wallets (user_id) VALUES (?)";
                   req.db.query(query,[first_name, last_name, email, password, is_admin, api_key], function (err, result, fields) {
                       if (err) throw err;

                       if (result.affectedRows) {
                           const newUser = {
                               id: result.insertId,
                               access_token: api_key,
                               first_name: req.body.first_name,
                               last_name: req.body.last_name,
                               email: req.body.email,
                               is_admin: false
                           };

                           res.status(200).json(newUser);
                           req.db.query(query2, [result.insertId], function (err, result, fields) {
                               if (err) throw err;
                           })
                       }
                   });
               }
            });

        }else{
            res.status(400).json({message : "Invalid email address"});
        }

    }

});

userRouter.use(function (req, res, next) {
    if("x-auth-token" in req.headers){
        let access_token = req.headers["x-auth-token"];
        let query = "SELECT users.id, users.email, users.is_admin, wallets.id as wallet_id FROM users JOIN wallets on users.id = wallets.user_id WHERE api_key = ?";

        req.db.query(query,[access_token], function (err, result, fields) {
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
                res.status(401).json({message: "Access unauthorized"});
            }
        });
    }else{
        res.status(401).json({message: "Access unauthorized"});
    }
});

userRouter.get('/', function (req, res) {
    let query = "SELECT * FROM users WHERE id=?";

    req.db.query(query,[req.user.id], function (err, result, fields) {
        if (err) throw err;
        if(result.length > 0){
            console.log(result.length);
            const selectedUsers =[];
            for(let i = 0; i<result.length; i++) {
                const tempUser ={
                    id:result[i].id,
                    first_name:result[i].first_name,
                    last_name:result[i].last_name,
                    email:result[i].email,
                    is_admin:false
                }
                selectedUsers.push(tempUser);
            };
            console.log(selectedUsers);
            res.status(200).json(selectedUsers);
        }

    });
});

userRouter.get('/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let query = "SELECT * FROM users WHERE id=?";

    req.db.query(query,[id], function (err, result, fields) {
        if (err) throw err;

        if(result.length > 0){
            const selectedUser = {
                id: result[0].id,
                first_name: result[0].first_name,
                last_name: result[0].last_name,
                email: result[0].email,
                is_admin: false
            }

            res.status(200).json(selectedUser);
        }else{
            res.status(404).json({message: "User not found"});
        }
    });
});

userRouter.put('/:id(\\d+)', function (req, res) {
    let id = req.params.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;

    if (first_name === undefined || last_name === undefined || email === undefined) {
        res.status(400).json({message: "Missing fields"});
    }else{
        if(email.toString().indexOf("@")>0){
            let verifyUserQuery = "SELECT * FROM users WHERE id=?";
            let query = "UPDATE users SET ?  WHERE id=?";

            const updateDict = {
                first_name: first_name,
                last_name: last_name,
                email: email
            }

            req.db.query(verifyUserQuery, [id], function (err0, result0, fields) {
                if(err0) throw err0;

                if(result0.length > 0){
                    if(id == req.user.id) {
                        req.db.query(query, [updateDict, id], function (err, result, fields) {
                            if (err) throw err;

                            const updatedUser = {
                                id: id,
                                first_name: first_name,
                                last_name: last_name,
                                email: email,
                                is_admin: false
                            }
                            res.status(200).json(updatedUser);
                        });
                    }else{
                    res.status(403).json({message : "Access to this user forbidden "});
                    }
                }else{
                    res.status(404).json({message: "User not found"});
                }
            });

            }else {
                res.status(400).json({message: "Invalid Email Address"});
            }
        }




});

userRouter.delete('/:id(\\d+)', function (req, res) {
    let id = req.params.id;

    let existingUserQuery = "SELECT * FROM users WHERE id = ?";
    let query = "DELETE FROM users WHERE id=?";

    req.db.query(existingUserQuery,[id], function (err, result, fields) {
        if(err) throw err;

        if(result.length > 0){
            if(id == req.user.id){
                req.db.query(query,[id], function (err2, result2, fields2) {
                    if (err2) throw err2;

                    if(result2.affectedRows > 0){
                        res.status(204).json({message: "Success"});
                    }
                });
            }else {
                res.status(403).json({message: "Access Denied"});
            }
        }else{
            res.status(404).json({message : "User not found"});
        }
    })

});

module.exports = userRouter;

