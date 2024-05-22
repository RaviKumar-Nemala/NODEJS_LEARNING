let bcrypt = require('bcrypt');
let fs = require('fs');
let path =  require('path');
let UserDb = require('../DB/userdb');
let user_db = new UserDb();
let async_handler  = require('../UTILS/async_hander')
let USER_ROLES = require( '../UTILS/user_roles')
let passport = require('passport');
let check_login_credentials =  async_handler( async( req , res , next )=>
{
    console.log( req.body);
    let { email, password } = req.body;
    if ( !email || !password )
    {
        next ( 'INVALID EMAIL ID OR PASSWORD');
    }
    let user =  await user_db.get_user( email);
    console.log( user);

    if ( user == null )
    {
         throw new Error( 'INVALID USER DETAILS');
    }
    
    let match = await compare_passwords(password, user.password);
    
    if ( match )
    {
        req.user = user;
        next() ;
    }
    else 
    {
        throw new Error( 'INVALID PASSWORD ');
    }
}
)

let check_loggedin =  ( req , res , next )=>
{

}

let check_loggedout = ( req, res, next)=>{
   
}

let  make_logout = ( req , res , next )=>
{
   
}

let get_password_hash = ( password)=>
{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}
let compare_passwords = async ( password , hashed_password)=>
{
    let match =  await bcrypt.compare(password , hashed_password);
    
    return match;
}

function get_public_key()
{

    let data = fs.readFileSync(path.join(__dirname , '../KEYS/public_key.pem'),'utf-8');
    return data;
}
function get_private_key()
{
    let data = fs.readFileSync(path.join(__dirname , '../KEYS/private_key.pem'), 'utf8');
    return data;
}


let check_admin = ( req , res  , next )=>
{
    console.log( 'CHECK ADMIN CALLED');
    // console.log( req.user);
    // console.log( req.headers)
    let user = req.user;
    if ( !user || !user.authorities )
    {
        //in the first syntax  the error handler is called but in the global error handler 
        //the err object will be of type string not the erro object 
        
        // next('invlaid user details')

        next( new Error('INVALID USER DETAILS') );
    }
    const ROLE = user.authorities.role ;


            if ( ROLE == USER_ROLES.ADMIN)
            {
                 next();
            } 
            else 
            {
                console.log( 'error handler ')
                next( new Error( 'ADMIN PRIVILIGES ARE REQUIRED'));
            }
}

module.exports =  { check_loggedin , check_loggedout , make_logout , get_password_hash , compare_passwords , check_admin , get_public_key , get_private_key  ,check_login_credentials };