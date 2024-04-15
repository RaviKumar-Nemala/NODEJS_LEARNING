let express = require('express');
let dotenv = require('dotenv');
let mysql = require('mysql2');

dotenv.config();

let app = express() ;


const bodyParser = require('body-parser');

//Middleware to parse the request body for JSON
app.use(bodyParser.json());


let employee_router = require('./DEMO/employeeRoute.js');

let log = require('./logger.js');

app.use('/employee', employee_router);

app.listen(3000,  ( )=>
{
    log('listening on port 3000');    
})
