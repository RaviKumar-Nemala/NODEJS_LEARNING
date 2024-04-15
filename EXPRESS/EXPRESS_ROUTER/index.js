let fs = require('fs');

let { log } =  require('./LOGGER/logger.js');

log( 'hello');

let express  = require('express') ; 

let app = express();

// since the export from userRoute is not a object 
//it is just a function so we can use any name for that function 
//if we use  mdoule.exports = { functon}  then during the import process we have to use same function name which we used to define at that location

let usersRouter = require('./ROUTES/userRoutes.js');
let personalInfoRouter = require('./ROUTES/personalInfo.js');

let captureRequest =  ( req,  res , next ) =>
{
     log (req.url + ' '  + ' METHOD = ' + req.method );
     next();
}
app.use( captureRequest); 

app.use( '/users' , usersRouter );

app.use( '/personalinfo' , personalInfoRouter );

app.listen( 3000 , ( ) =>
{
      log ( 'server is listening on the port 3000 ' ) ;
})