import { async_handler } from "../utils/async_handler";
import { Request , Response, NextFunction } from 'express';
import { Api_Error } from "../errors/my_errors";
import { Course_Db } from "../db/course_db";


export class Course_Controller
{
    constructor(private course_db = new Course_Db())
    {

    }

    create_course = async_handler( async( req:Request, res:Response,next:NextFunction)=>
    {
        let{ course_name } = req.body;
        console.log( course_name);
        if( course_name == undefined || course_name.length< 2)
        {
            throw new Api_Error('COURSE NAME SHOULD NOT BE NULL AND SHOULD HAVE ATLEAST 2 CHARACTERS',400);
        }
        
        let details = await course_db.create_course( course_name);
        return res.json(
            {
                data : details,
                message :'COURSE CREATED SUCCESSFULLY'
            }
        );
    })
    

   
}