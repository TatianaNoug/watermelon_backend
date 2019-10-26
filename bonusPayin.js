const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var payinsRouter = express.Router();

payinsRouter.use(bodyParser.urlencoded({extended: true}));



module.exports = payinsRouter;