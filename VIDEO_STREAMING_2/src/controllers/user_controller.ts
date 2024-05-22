import { User_Db } from "../db/user_db";
import { async_handler}  from '../utils/async_handler'
import { Request , Response, NextFunction} from 'express';
import { hash_password}  from '../utils/jwt_utils';
import { Api_Error} from '../errors/my_errors'
import { User_Dto } from '../types/my_types';
import { User_Entity } from "../entities/user_entity";
export class User_Controller 
{
    constructor( private user_db =  new User_Db()  )
    {

    }

    add_user = async_handler( async( req :Request , res : Response , next : NextFunction) =>
    {
        let { username , password }  = req.body ;
        if ( !username || !password )
        {
            throw new Api_Error( 'USERNAME OR PASSWORD SHOULD NOT BE NULL' , 400);
        }

        let hashed_password = hash_password( password);
        
        let result = await this.user_db.add_user( { username : username, password: hashed_password});

        return res.json( { status : 'success' , data : result});
    })

    get_user = async_handler( async( req :Request , res: Response , next:NextFunction)=>
    {
         let { username} = req.params ;
         console.log( username );
        
         let user_details:User_Entity|null= await this.user_db.get_user_by_name( username );
        if( user_details == null )
        {
            throw new Api_Error( 'INVALID USERNAME' , 404);
        }
        let user_dto : User_Dto = {username : user_details.username}
         return res.json({ data : user_dto});
    })
}