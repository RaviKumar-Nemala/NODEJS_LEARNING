import { User_Db } from "../db/user_db";
import { async_handler}  from '../utils/async_handler'
import { Request , Response, NextFunction} from 'express';
import { hash_password}  from '../utils/password_utils';
import { Api_Error} from '../errors/my_errors'
import { Course_Db } from '../db/course_db';
export class User_Controller 
{
    constructor( private user_db =  new User_Db() , private course_db = new Course_Db() )
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

        return res.json( { status : 'success' , data : 'USER RECORD INSERTED' });
    })

    link_to_course = async_handler( async( req : Request , res : Response , next : NextFunction)=>
    {
        let { username , course_name } = req.body;
        console.log( username , course_name);

        if( !username || !course_name )
        {
            throw new Api_Error('USERNAME OR COURSE NAME SHOULD NOT BE NULL');
        }
        
        let user_entity = await this.user_db.get_user( username);
        
        let course_entity = await this.course_db.get_course( course_name);

        await this.user_db.link_to_course( user_entity.id , course_entity.course_id);

        return res.json({data:'LINKED THE USER WITH THE  COURSE ', success : true });
    })
}