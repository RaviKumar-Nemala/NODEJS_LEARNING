import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import{ Api_Error} from '../errors/my_errors'
import {User_Db } from '../db/user_db'
import { User_Relations } from '../types/my_types'
import { User_Entity } from '../entities/user_entity'

let user_db = new User_Db () ;

function get_public_key ( )
{   
    let  public_key = fs.readFileSync(path.join(__dirname,'../keys/public.pem'));
    return public_key;
}

function get_private_key ()
{
    return fs.readFileSync( path.join(__dirname ,'../keys/private.pem'))
}

const EXPIRY_TIME = 10*60*1000;
const PRIVATE_KEY = get_private_key ();
const PUBLIC_KEY = get_public_key () ;

export const hash_password  = ( password:string)=>
{
    let salt = bcrypt.genSaltSync(10);

    let pass_hash = bcrypt.hashSync(password , salt );

    return pass_hash;
}

export const is_valid_password = ( hash_password :string , plain_password  :string )=>
{
    return bcrypt.compareSync(plain_password , hash_password);
}

export  function generate_token( username:string )
{
    const payload =
    {
        sub : username , 
        iat : Date.now()/1000,
        exp : (Date.now() + EXPIRY_TIME)/1000
    }

    let token = jsonwebtoken.sign(payload, PRIVATE_KEY , { algorithm : 'RS256'})

    return  { token : 'Bearer '+ token , expiresIn : EXPIRY_TIME};
}
export  const validate_token =  async( jwt_token : string, user_relations:User_Relations  ):Promise<User_Entity>=>
{

    if ( !jwt_token )
        throw new Error ('INVALID JWT TOKEN');

    let token =  jwt_token.split(' ');
    console.log( token );
    
    try{
    if( token.length != 2 || token[0] !='Bearer' || token[1].match(/\S+\.\S+\.\S+/) == null)
    {
        throw new Api_Error('INVALID JWT TOKEN',401);
    }
    let verified_token = jsonwebtoken.verify(token[1] ,PUBLIC_KEY , { algorithms:['RS256']} );
    let {sub} = verified_token;
    
    if ( typeof sub != 'string')
    {
        throw new Error ('INVALID TOKEN FORMAT');
    }

        let user ; 
        if( user_relations.courses)
            user =await user_db.get_user_with_relations(sub );
        else if ( user_relations.authority)
            user = await user_db.get_user_with_authorites(sub);
        else 
            user = await user_db.get_user( sub);
        console.log( user );
        return user;
    }
    catch ( err )
    {
        throw new Error('INVALID JWT TOKEN');
    }
}