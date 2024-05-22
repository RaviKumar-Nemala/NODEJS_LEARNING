let express = require('express');
let app = express();
let passport = require('passport');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser')

let {check_admin , check_login_credentials }  = require('./CONTROLLERS/login_controller');
let {initPassportJwt ,issue_jwt , authenticate , authenticate_cookie} = require('./CONFIG/passport_jwt_config');

let UserController =  require('./CONTROLLERS/user_controller');
let user_controller = new UserController();

//Middleware to parse the request body for JSON
app.use(bodyParser.json());

app.use (cookieParser())

// app.use( passport.initialize() );

// initPassportJwt();

app.get('/' ,  ( req, res , next )=>{
   console.log( req.cookies);

   return res.send( `<h1>WELCOME TO HOME PAGE</h1>` );
})


/*
   USING THE PASSPORT LIBRARY TO VALIDATE THE USER
app.get('/protected' , passport.authenticate('jwt', { session : false ,successRedirect :'/' , failureRedirect : '/login'}) , ( req , res, next)=>
{
   res.writeHead( 200 , { 'Content-Type': 'text/html' } );
    res.end('<h1>WELCOME TO PROTECTED ROUTER </h1>')
} 
)
*/


app.get( '/protected' , authenticate_cookie ,  ( req , res )=>
{
   console.log( req.cookies);
   // console.log( req);
    return res.json({ success : true,  message : 'FROM THE  PROTECTED ROUTER'});
})

app.get('/admin/protected' , authenticate_cookie , check_admin,  ( req, res , next)=>
{
   return res.json ( { success : true , message : ' PROTECTED ROUTE FOR ADMIN '});
} )



/*
//USING THE HTTP HEADERS TO CHECK THE TOKEN 
app.get('/admin/protected' , authenticate , check_admin,  ( req, res , next)=>
{
   return res.json ( { success : true , message : ' PROTECTED ROUTE FOR ADMIN '});
} )

*/

// app.get('/protected' , passport.authenticate('jwt', ( err , user, info , status )=>{

//     console.log(err);
//     console.log(user);
//     console.log(info);
//     console.log( status)
// }
// ) );



app.get( '/login' , (req, res, next)=>
{
  return res.send( `<h1>login page</h1>` );
})

/*
//if the login creadentials are correct then user object is placed in the request object 
//with out using the cookies

app.post('/login' , check_login_credentials , ( req , res , next )=>
{
   let {token, expiresIn}  =  issue_jwt(req.user);
   return res.json({ token : token});
});


*/



//if the login creadentials are correct then user object is placed in the request object 
//using the cookies 
app.post('/login' , check_login_credentials , ( req , res , next )=>
{
   let {token, expiresIn}  =  issue_jwt(req.user);
   
   //the max age is tells the how many millseconds does the cookie is  alive from the current time
   //to set the cookie age as 2 minutes we use ( 2 * 60 * 1000)

   res.cookie( 'jwt_cookie' ,  token , { httpOnly : true  , maxAge : Math.abs( expiresIn - Date.now() ) } );
   res.cookie('temp', 'temp_data' , { httpOnly : true , maxAge : Math.abs( expiresIn-Date.now())});

   return res.json({success : true  , message : 'LOGING SUCCESS'} );
});


app.post('/logout' ,  (req , res, next) =>
{
   res.clearCookie('jwt_token');
   return res.json( { sucess : true ,message : 'COOKIE IS CLEARED'});
});

app.post ( '/register', user_controller.create_user);

app.post ('/register/admin' , user_controller.create_admin_user);

app.get ( '/admin_res' , check_admin , ( req, res, next ) => {
  return res.send(`<h1> welcome to admin page </h1>`);
} )

app.use( ( err , req , res , next )=>
{
    console.log( err )
    return res.status( 500 ).json( { error : err.message || 'SOMETHING WENT WRONG' } );
})

app.listen(3000 ,( )=>
{
   console.log( 'LISTENING ON PORT 3000');
})