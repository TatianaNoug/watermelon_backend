const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var walletRouter = express.Router();

walletRouter.use(bodyParser.urlencoded({extended: true}));

walletRouter.put('/:id(\\d+)', function (req, res) {
   res.status(404).json({message : "Wallet Not found"});
});

walletRouter.delete('/:id(\\d+)', function (req, res) {
    res.status(404).json({message : "Wallet Not found"});
});

module.exports = walletRouter;