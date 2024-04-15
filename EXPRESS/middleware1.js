let { log } = require('../MODULES/logger');

let express = require( 'express');

let app = express();

let captureData = ( req, res , next)=>
{
    log ( req.url + ' / ' + req.method);
    res.status( 200).write('default url');
    next();
}

//capture data is a middleware 
// when ever any request is coming to this url  then captureData middleware function will be executed
//first

app.get( '/' , captureData , ( req , res )=>
{
     return res.status( 200).end('default url');
})

app.get( '/about' , captureData, ( req, res) =>
{
    return res.status( 200).end('ABOUT URL ');
});

app.listen( 3000, ()=>
{
    log( 'server is listening at port 3000 ');   
}
);