const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var payoutRouter = express.Router();

payoutRouter.use(bodyParser.urlencoded({extended: true}));

payoutRouter.put('/:id(\\d+)', function (req, res) {
    res.status(404).json({message : "Wallet Not found"});
});

payoutRouter.delete('/:id(\\d+)', function (req, res) {
    res.status(404).json({message : "Wallet Not found"});
});

module.exports = payoutRouter;