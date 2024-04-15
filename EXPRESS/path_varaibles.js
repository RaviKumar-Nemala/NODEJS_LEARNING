const { log } = require('../MODULES/logger');

const express = require('express');

const bodyParser = require('body-parser');

//Middleware to parse the request body for JSON
app.use(bodyParser.json());

const app = express();



//every pathvariable is in the format of string  defautlty
//have to convert them accordingly 
app.get("/students/:studentId", (req, res) => {
        log( req.params )
        let { studentId } = req.params
        return res.end('called studentId = ' + studentId);
    }
    )
app.get("/students/:yearId/:studentId" , ( req, res ) =>
{
        log ( req.params)
        let{  yearId , studentId } = req.params;
        log(  yearId + ' ' + studentId );
        return res.json( { studentId : studentId , yearId :  yearId  } );
})

//expecting the  the data should be in the body ( Sample case for demo )
app.post( "/addStudent" , ( req , res ) => 
{
    log(req.body);
    let { studentId , name , yearId } =  req.body;
    return res.json( { studentId : studentId, name : name, yearId :  yearId  } );
}   
)

app.listen( 3000 ,()=>
{
     log('server listening on port 3000');
})