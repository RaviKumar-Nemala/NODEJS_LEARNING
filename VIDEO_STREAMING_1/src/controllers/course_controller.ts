import { async_handler } from "../utils/async_handler";
import { Request , Response, NextFunction } from 'express';
import { Api_Error } from "../errors/my_errors";
import { Course_Db } from "../db/course_db";
import { User_Course_Entity} from '../entities/user_course_entity';

export class Course_Controller
{
    constructor(private course_db = new Course_Db())
    {

    }

    add_course=
         async_handler( async( req :Request , res : Response , next: NextFunction)=>
        {
            let {course_name} = req.body;
            console.log( course_name );
            await this.course_db.add_course( course_name);
            return res.json( { data :'course added successfully' , success :true });
        }
         )
    //returns  the all the user mapped courses
    send_courses = async_handler( async( req :Request, res :Response , next :NextFunction)=>
    {
        let user = req.user;
        console.log( user );
        if ( user == undefined)
        {
            throw new Api_Error('COURSES NOT FOUND WITH THE GIVEN USERNAME ' , 404 );
        }
        let courses_entities:User_Course_Entity[] =  user.courses;
        let course_ids:Object[] = [];
        for ( let course_entity of courses_entities )
        {
            course_ids.push( { course_id : course_entity.course_id});
        }
        console.log (course_ids)
        return res.json ( { data : course_ids , success : true } );
    })

    //returns the specific course info like video metatdata , title etc
    send_course_info = async_handler( async( req:Request ,res:Response , next :NextFunction)=>
    {
        console.log ('course controller called');
        let { course_id } = req.body;
        course_id = Number( course_id);

        let videos_info = await this.course_db.get_course_videos_metadata(course_id);
        return res.json (videos_info);
    })
}