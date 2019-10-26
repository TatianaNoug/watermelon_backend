const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var walletRouter = express.Router();

walletRouter.use(bodyParser.urlencoded({extended: true}));

walletRouter.put('/', function (req, res) {
    
})

module.exports = walletRouter;