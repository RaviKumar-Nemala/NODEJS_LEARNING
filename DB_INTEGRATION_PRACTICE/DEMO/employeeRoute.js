let express = require('express');

// let app = express();    

let app = express.Router();
let log =  require('../logger.js');

let emp_service = require('./EmployeeService');
console.log( emp_service)

app.get('/:id',emp_service.get_employee_by_id);

app.get('/' , emp_service.get_employee)

app.post('/add' ,emp_service.add_employee);

app.delete('/:id', emp_service.delete_by_id);

// process.on('unhandledRejection', (reason ,promise) => {
//     console.log('unhandled rejection called');

// });

app.use( ( err , req , res, next ) =>
{
    console.log( 'ERROR HANDLER called');
    let { message , statusCode , status } = err;
    return res.status( statusCode || 500 ).json (
        {
        status : status || 'fail',
        statudCode : statusCode || 500,
        message : message ||'something went wrong'
        }
    );
})

module.exports =  app;