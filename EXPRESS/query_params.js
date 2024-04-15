const { log } = require('../MODULES/logger');

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

//Middleware to parse the request body for JSON
app.use(bodyParser.json());


app.listen(3000 , ()=>
{
    log('server listening at port 3000');
});


let {students} = require('./public/students.js');

log( students) ;
app.get('/getStudents' ,  ( req, res) =>
{
    return res.status( 200 ).json( students ) ;    
}) 

app.get('/studentById' ,  ( req , res)=>
{   
    //all values in the query string are in the string fomat
    log( req.query); 

    let { studentId } = req.query;

    studentId = Number( studentId );
    if( !studentId)
        return res.status(400).end('invalid studentId it must be interger');

    const student = students.find( s=>s.id === studentId);
    if( student)
    {
        return res.status(200).json( student );
    }
    else   
        return res.status(200).end('RECORD NOT FOUND');
})

