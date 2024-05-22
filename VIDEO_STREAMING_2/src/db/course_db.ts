import { AppDataSource } from '../config/db_config';
import { Repository } from 'typeorm';
import { Course_Entity } from '../entities/course_entity';
import { Api_Error } from '../errors/my_errors';
import { COURSE_VIDEO_CHECK} from '../types/my_types'

export class Course_Db
{
    private course_repo :Repository<Course_Entity> ;
    constructor( )
    {
        this.course_repo = AppDataSource.getRepository(Course_Entity);
    }
    async get_course(course_name:string)
    {
        let details = await this.course_repo.find(
            {
                where :
                {
                    course_name : course_name
                }
            }
        );
        console.log( details );
        return details;
    }
    async create_course ( course_name:string)
    {
        if ( this.get_course(course_name) != null )
        {
            throw new Api_Error ('COURSE ALREADY EXISTS', 400 );
        }
        try{
            let res = await this.course_repo.insert(
                {
                    course_name : course_name
                }
            );
            console.log( res);
            return res;
        }
        catch ( err)
        {
            throw new Api_Error( 'SOMETING WENT WRONG WHILE CREATING THE COURSE',500);
        }
    }  
}