const express = require('express');
const bodyParser = require('body-parser');

let loginRouter = express.Router();
loginRouter.use(bodyParser.urlencoded({extended: true}));

loginRouter.post('/', function (req, res) {
   let email = req.body.email;
   let password = req.body.password;

   if(email === undefined || password === undefined){
       res.status(400).json({message : "Missing Fields"})
   }else{
       let query = "SELECT api_key FROM users WHERE email=? AND password=?";

       req.db.query(query,[email, password], function (err, result, fields) {
           if(err) throw err;
           if(result.length > 0){
               const login = {
                   access_token:result[0].api_key
               };
               res.status(200).json(login);
           }else{
               res.status(401).json({message: "Access unauthorized"});
           }

       })
   }

});

module.exports = loginRouter;