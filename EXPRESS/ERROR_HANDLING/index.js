let express = require('express');
let app = express();

console.log ( 'hell and heaven');

/*
    IF WE WANT GLOBAL EXCEPTION HANDLER CAPTURE ALL THE ERRORS IN OUR CODE
    THEN IT SHOULD BE PLACED AS LAST MIDDLE WARE 
    THEN ONLY WHEN WE CALL THE NEXT( PARAMS ) METHOD WILL TRIGGER THAT ERROR HANDLER 
*/

let f1 =  ( req, res , next )=>{
    let err = new Error( 'hello');
    throw err;
}


// app.use('/check' , ( req,res, next)=>
// {
//     return res.status(404).json('hello there');
// })

let errorHandler = ( err, req , res , next)=>
{
    console.log('reached');
    
    let statusCode = err.statusCode || 500;
    let status = err.status || 'fail';
    let message = err.message || 'Internal Server Error';
    
    console.log ( err.message);
    
    // Error.captureStackTrace(this );
    return res.status( statusCode).send( { status : status , message : message});
}

// let trycatch = require('./trycatch.js');
let trycatch = (controller) => ( req , res , next)=>
{
    try{
        controller(req, res );
    }
    catch ( err )
    {
        return next(  err );
    }
}



app.get ('/' ,
trycatch(  ( req, res ) =>
{
   
    f1(req, res);
    // console.log ( 'called')
    // // new Error( 'custom error');
    // let err = new Error( 'custom error');
    // err.statusCode = 400 ;
    // err.status = 'fail';
    // throw err;
    
})
)

function trigger ( )
{
    throw new Error('CALLED FROM TEMP END POINT');

}
let handle  = ( req , res , next )=>
{
     let a = 10;
     if( a == 10 )
     {
        return res.send('hell and heaven');
     }
     next();
}

app.get('/temp',handle , (req, res )=>
{
     return res.send('from temp api')
})

app.get('/check',  async(req, res, next)=>
{
    trigger();
})

app.use( errorHandler) ;

app.listen( 3000 , ( )=>
{
    
});

