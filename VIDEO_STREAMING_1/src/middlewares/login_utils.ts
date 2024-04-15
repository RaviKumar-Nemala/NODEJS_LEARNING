import { Request, Response , NextFunction } from 'express';
// import { jsonwebtoken}  from 'jsonwebtoken'
import { User_Db } from '../db/user_db'
import { User_Course_Db} from '../db/user_course_db'

let user_db = new User_Db();
let user_course_db = new User_Course_Db();
import { Api_Error } from '../errors/my_errors'
import { async_handler } from '../utils/async_handler'
import { is_valid_password , generate_token , validate_token } from '../utils/password_utils';
export const JWT_COOKIE:string = 'jwt_cookie'
export const authenticate = async_handler(async( req : Request, res : Response , next: NextFunction)=>
{   
    let { username , password }  = req.body;
    if ( !username || !password)
    {
       throw new Api_Error('USERNAME OR PASSWORD ARE NOT MATCHING' , 401)
    }   
    let user_entity = await user_db.get_user( username );
    console.log( user_entity);
    const match:boolean = is_valid_password(user_entity.password , password)
    console.log( match );
    if ( !match )
    {
        throw new Api_Error('INVALID PASSWORD',401);
    }
    const {token,expiresIn} = generate_token ( username );

    res.cookie(JWT_COOKIE,token , { httpOnly : true , maxAge : Math.abs( expiresIn - Date.now() ) })
    
    return res.json({success: true , data : 'authenticated successfully'});
}
)

function check_user_valid ( user :any,  next :NextFunction)
{
    if (user == null  || user == undefined)
    {
        next(new Api_Error('INVALID JWT TOKEN',401));
    }
    return;
}
export const  check_credentials = async_handler( async ( req :any ,res : Response, next : NextFunction)=>
{
    console.log( req.cookies);
    let { jwt_cookie } = req.cookies;
    // console.log( jwt_cookie);
    //we want to load relations like user authorities and the registered courses etc
    //this is useful for sending the course details
    const user =  await validate_token (jwt_cookie , { courses : true } );

    check_user_valid(user , next );
    req.user = user ;
    next();
})

export const check_user_linked_with_course  = async_handler( async( req :Request ,res : Response , next :NextFunction) =>{
    
    let { jwt_cookie } = req.cookies;

    let { course_id } = req.body ;
    
    if ( course_id == undefined )
    {
        next( new Api_Error ('INVALID  COURSE ID ', 400 ));
    }

    let user =  await validate_token ( jwt_cookie ,  { authority: true});
    
    //if the record not found then it throws the error so the error handler will be called
    let record = await user_course_db.check_user_attached_with_course( { course_id : course_id , user_id : user.id , role : user.authority.role});
    
    req.user = user ;
    
    console.log (record);
    console.log(user);

    next();
})
