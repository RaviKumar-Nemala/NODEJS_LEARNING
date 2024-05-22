import { Request, Response, NextFunction  } from 'express'
import  { async_handler } from '../utils/async_handler'
import { validate_token } from '../utils/jwt_utils'
import { Api_Error} from '../errors/my_errors'
import { Course_Db } from '../db/course_db'

let course_db = new Course_Db() ;
//this function check if the given course has the video that is requesing
//also checks that the requested user is linked with the course
export const check_user_attached_with_video = async_handler ( async(req:Request , res:Response , next:NextFunction )=>
{   
    console.log ('called video checker');
    let { jwt_cookie }  = req.cookies;
    console.log( jwt_cookie);
    let user = await validate_token( jwt_cookie , { authority : true } );
    console.log( user );
    if ( user == null )
    {
        throw new Api_Error ('INVALID USERNAME OR TOKEN MIGHT ME EXPIRED',401);
    }
    console.log( req.query);
    let { video_id , course_id } = req.query; 

    let vid = Number ( video_id );
    let cid = Number ( course_id );

    if( vid == undefined  || cid == undefined)
    {
        throw new Api_Error('INVALID COURSE ID OR VIDEO ID ' , 400 );
    }

    console.log(video_id , course_id );
    
    let content = await course_db.check_user_linked_with_course_and_video({course_id :cid , video_id :vid , role : user.authority.role, user_id : user.id});
    console.log( content.videos);
    req.video_content = content.videos[0];
    next();
}
)