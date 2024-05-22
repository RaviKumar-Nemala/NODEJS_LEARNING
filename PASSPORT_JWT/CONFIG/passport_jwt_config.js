let JwtStrategy  = require('passport-jwt').Strategy;
let ExtractJwt  = require('passport-jwt').ExtractJwt;
let jsonwebtoken = require('jsonwebtoken');

let UserDb = require('../DB/userdb');
let passport = require('passport');

let user_db = new UserDb();
const { get_public_key , get_private_key} = require('../CONTROLLERS/login_controller');
const PUBLIC_KEY = get_public_key();
const PRIVATE_KEY = get_private_key();
// console.log( PUBLIC_KEY);

var options = {}

    options.jwtFromRequest =  ExtractJwt.fromAuthHeaderAsBearerToken(),
    options.secretOrKey = PUBLIC_KEY,
    // issuer  : 'myapp.com',
    // audience : 'myconsumer.com',
    options.algorithms =  ['RS256']

/*

issuer: Specifies the issuer of the token. This is typically the identity provider or authentication 
service that issued the token. For example,
if your application uses a service like Auth0 for authentication, Auth0 would be the issuer. 
Specifying the issuer helps you verify the authenticity of the token.

audience: Specifies the intended audience for the token. In other words, 
it indicates which application or service the token is meant for. This 
ensures that the token is not used by a different application than the one it was intended for.

*/

let verify_callback = async ( jwt_payload , done )=>
{
    try{
    console.log('verify call back called');
     console.log( jwt_payload);
     let email = jwt_payload.sub;
     let user = await user_db.get_user(email);
     if (!user ) {
        return done(null, false);
    }
    else {
        return done( null ,user);
    }
}

catch ( err )
{
    console.log('error encoutered');
    console.log( err.message);
    return done ( err , false )
}
}

let initPassportJwt = ()=>
{
    console.log('called init passport jwt');
    passport.use ( new JwtStrategy(options , verify_callback ));
}

//we are using the user email as the unique identifier 
//encrypting using the private key 
const issue_jwt = ( user )=>
{
    const email = user.email;
    
    //expires takes the time in seconds not in milliseconds
    // const expiresIn = (Date.now()/1000)+ ( 2 * 24 * 60 * 60 );
    const expiresIn = Date.now() +  ( 2*60*1000) ;
    const payload = {
        sub : email,
        iat : Math.floor(Date.now() / 1000),
        exp : Math.floor(expiresIn/1000)
    }
    console.log( payload);

    let token = jsonwebtoken.sign(payload , PRIVATE_KEY , { algorithm : 'RS256'} );

    console.log( token );

    return { token : "Bearer " + token , expiresIn : expiresIn };
}

let check_token  = async (req , res , next , token)=>
{
    try{
    let jwt =  token.split(' ');

    if( jwt [ 0 ] !== 'Bearer'  ||  jwt[1].match(/\S+\.\S+\.\S+/) == null )
    {
        throw new Error( 'INVALID JWT TOKEN ');
    }
    
    const  verification = jsonwebtoken.verify(jwt[1] , PUBLIC_KEY, { algorithms : ['RS256']});
    console.log( verification);
    let  { sub:email } =  verification ; 
    console.log( email );
    let user = await user_db.get_user( email ) ;
    if  (user == null ) 
    {
        throw new Error ( 'user does not exist');
    }
    console.log( user );
    req.user = user ;
    next ( );
}

catch( err )
{
    if ( err  instanceof  jsonwebtoken.JsonWebTokenError)
    {
        console.log( 'web token error');
        next( err );
    }
    else if ( err instanceof jsonwebtoken.TokenExpiredError)
    {
        console.log('token has expired')
        next(new Error('TOKEN HAS EXPIRED  '))
    }
    else if ( err instanceof  SyntaxError )
    {
        next ( new Error ( 'INVALID JWT FORMAT'))
    }
    else 
    {
        console.log( err.message);
        next ( err );
    }
}
}

let authenticate_cookie = async (req , res ,next )=>
{
    try{
    let  { jwt_cookie } =  req.cookies; 
    if ( !jwt_cookie)
    {
        throw new Error('TOKEN DOES NOT FOUND ');
    }
        await check_token( req, res , next , jwt_cookie);
        next();
    }
    catch ( err )
    {
        next( err );
    }
}

//IF THE TOKEN PLACED IN THE HEADERS PART WE USE THIS MECHANISM
let authenticate  = async ( req , res, next )=>
{
    try{
    let headers   = req.headers;
    console.log( headers );
    let { authorization } = headers ;
    console.log (authorization);

    if ( !authorization )
    {
        throw new Error ( ' AUTHORIZATION HEADER IS NOT PRESENT ');   
    }

    let jwt =  authorization.split(' ');

    if( jwt [ 0 ] !== 'Bearer'  ||  jwt[1].match(/\S+\.\S+\.\S+/) == null )
    {
        throw new Error( 'INVALID JWT TOKEN ');
    }
    
    const  verification = jsonwebtoken.verify(jwt[1] , PUBLIC_KEY, { algorithms : ['RS256']});
    console.log( verification);
    let  { sub:email } =  verification ; 
    console.log( email );
    let user = await user_db.get_user( email ) ;
    if  (user == null ) 
    {
        throw new Error ( 'user does not exist');
    }
    console.log( user );
    req.user = user ;
    next ( );
}

catch( err )
{
    if ( err  instanceof  jsonwebtoken.JsonWebTokenError)
    {
        console.log( 'web token error');
        next( err );
    }
    else if ( err instanceof jsonwebtoken.TokenExpiredError)
    {
        console.log('token has expired')
        next(new Error('TOKEN HAS EXPIRED  '))
    }
    else if ( err instanceof  SyntaxError )
    {
        next ( new Error ( 'INVALID JWT FORMAT'))
    }
    else 
    {
        console.log( err.message);
        next ( err );
    }
}

}

module.exports = {initPassportJwt, issue_jwt , authenticate , authenticate_cookie};