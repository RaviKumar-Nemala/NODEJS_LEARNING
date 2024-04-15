let { log } = require('../MODULES/logger');

let express = require( 'express');

let app = express();

let temp ;
let captureData = ( req, res , next)=>
{
    temp  = req;
    log ( req.url + ' / ' + req.method);
    // res.status( 200).write('default url');
    next();
}

//BASE URL  SPECIFIES THE URL ON WHICH THE ROUTER WAS MOUNTED
// URL SPEIFIES THE FULL VALUE IN THIS CONTEXT REMAINGI
let specMiddleware = ( req , res , next )=>
{
    if( req === temp )
        log ('equal');
    log('SPECIFIC MILLEWARE');
    // log( req);
    // log( req. );

    log( req.baseUrl + ' /'  + req.url  + ' ' + req.method );
    next();
}
app.use( captureData );//all apis are should be below  inorder to intercept the requests

//use the speciMiddleware function for all the endpoints starts withe /api

app.use( '/api', specMiddleware ) ;

/** 
can configure multiple middlewares at a time
let authorize = ( req, req, next)=>
{

}

app.use( [specMiddleware , authorize]);
*/

app.get( '/' , ( req , res )=>
{
    res.end('end of data');;
})

app.get( '/about' , ( req, res) =>
{
    return res.status( 200).end('ABOUT URL ');
});

app.get( '/api' , ( req, res) =>
{
    return res.status( 200).end('ABOUT URL ');
});

app.get( '/api/getprd' , ( req, res) =>
{
    return res.status( 200).end('ABOUT URL ');
});



app.listen(3000, ()=>
{
    log('server listening at port 3000');
});

