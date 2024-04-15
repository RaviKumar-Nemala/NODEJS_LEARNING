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
    //returns the course related vidoes metadata like video name ,video id etc
    async get_course_videos_metadata( course_id : number )
    {
        try{
            let matched_records = await this.course_repo.find (
                {
                    relations :
                    {
                        videos :true
                    },
                    select :
                    {   
                        videos : 
                        {
                            id : true ,
                            description:true,
                        },
                        course_id : true 
                    },
                    where : {
                        course_id : course_id
                    }
                }
            );
            if( matched_records.length == 0 )
            {
                throw new Api_Error ('CANNOT FIND ANY VIDOES WITH THE GIVEN COURSE ', 404 );
            }
            console.log( matched_records[0].videos[0]);

            return matched_records;
        }
        catch ( err : any )
        {
            console.log( err);
            return []
        }
    }

    async get_course ( course_name: string )
    {
        try{
            let res = await this.course_repo.findOne(
                {
                    where : {
                        course_name : course_name
                    }
                }
            );
            if ( res == null )
            {
                throw new Api_Error('CANNOT FIND COURSE WITH THE GIVEN NAME',404);
            }
            return res;
        }
        catch (err : any )
        {
            throw new Api_Error(err.message, err.statusCode);
        }
    }
    async add_course(name:string)
    {
        console.log( 'inside of the add_course db')
        try{
        let res = await this.course_repo.insert(
            {
                course_name : name
            }
        );
        console.log( name );
        console.log( res );
        }
        catch ( err : any )
        {
            console.log( err);

            throw new Api_Error('error while inserting the course')
        }
    }

    
    async check_user_linked_with_course_and_video(data:COURSE_VIDEO_CHECK):Promise<Course_Entity>
    {   
       let res = await  AppDataSource.createQueryBuilder(Course_Entity,'course')
        .leftJoinAndSelect( 'course.videos', 'videos')
        .leftJoinAndSelect('course.user_courses','user')
        .where('course.course_id = :course_id and user.user_id=:user_id and videos.id = :video_id' 
        , { course_id: data.course_id , user_id : data.user_id , video_id : data.video_id })
        // .select(['course.course_id' , 'videos.id' , 'user.user_id'])
        .getOne()
        
        if ( res == null )
        {
            throw new Api_Error( 'COURSE IS NOT LINKED WITH THE USER or VIDEO IS NOT LINKED WITH GIVEN COURSE' , 401)
        }
        return res;
    }
}