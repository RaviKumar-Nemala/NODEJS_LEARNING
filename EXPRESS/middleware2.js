let { log } = require('../MODULES/logger');

let express = require( 'express');

let app = express();


let captureData = ( req, res , next)=>
{
    log ( req.url + ' / ' + req.method);
    res.status( 200).write('default url');
    next();
}


//THIS URL  WILL NOT BE INTERCEPTED BY THE MIDDLEWARE FUNCTION BEACUSE  IT IS PLACED ABOVE THE 
// app.use function 

app.get ( '/temp'  ,( req, res )=>{
    log ( 'temp is called');
    res.status( 200).write('temp url ');
})

app.use( captureData );//all apis are should be below  inorder to intercept the requests


app.get( '/' , ( req , res )=>
{
    res.end('end of data');;
})

app.get( '/about' , ( req, res) =>
{
    return res.status( 200).end('ABOUT URL ');
});


app.listen(3000, ()=>
{
    log('server listening at port 3000');
});

