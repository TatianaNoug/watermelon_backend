const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var payoutRouter = express.Router();

payoutRouter.use(bodyParser.urlencoded({extended: true}));



module.exports = payoutRouter;