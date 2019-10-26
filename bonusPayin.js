const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var payinsRouter = express.Router();

payinsRouter.use(bodyParser.urlencoded({extended: true}));

payinsRouter.put('/:id(\\d+)', function (req, res) {
    res.status(404).json({message : "Wallet Not found"});
});

payinsRouter.delete('/:id(\\d+)', function (req, res) {
    res.status(404).json({message : "Wallet Not found"});
});

module.exports = payinsRouter;