let UserDb = require('../DB/userdb');
let user_db = new UserDb();
let async_handler = require('../UTILS/async_hander');
let {get_password_hash}  = require('./login_controller');
class UserController 
{
     constructor()
     {
         
     }
     create_user = async_handler( async ( req , res , next)=>
     {
      console.log('create user called');
        let  { email , password } = req.body;
        console.log( req.body)
        console.log( email + ' ' + password );
          if( !email || !password )
          {
                throw  new Error ( 'INVALID EMAIL OR PASSWORD');
          }
        
        //   let match = await user_db.get_user( email );
        //   if ( match )
        //   {
        //     throw new  Error( 'RECORD FOUND WITH USERNAME = ' + email );
        //   }   

        let hashed_passsword = get_password_hash( password );
        console.log( hashed_passsword);
          let user = await user_db.add_user( email , get_password_hash(password));

          return res.json( { message : 'USER CREATED SUCCESSFULLY', status : 'SUCCESS', user : user});

     })

     create_admin_user = async_handler( async( req, res , next)=>
     {
        let  { email , password } = req.body;
        if( !email || !password )
        {
              throw Error ( 'INVALID EMAIL OR PASSWORD');
        }
        let match = await user_db.get_user( email );
        if ( match )
        {
          throw Error( 'RECORD FOUND WITH USERNAME = ' + email );
        }   
        let hashed_passsword  = get_password_hash( password);
        let user = await user_db.add_admin( email , hashed_passsword);

        return res.json( { message : 'USER CREATED SUCCESSFULLY', status : 'SUCCESS', user : user});
     })
}

module.exports = UserController;