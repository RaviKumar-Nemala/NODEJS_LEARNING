import{ Student } from '../../types/student'
import { AppDataSource  } from '../../config/db_config'
import { Student_Entity } from '../../entities/ONE_TO_MANY/student'
import {Repository} from 'typeorm'
import { Posts_Db } from './posts_db';

export class Student_Db
{
    private  student_repo: Repository< Student_Entity>;

     constructor()
     {
        this.student_repo = AppDataSource.getRepository(Student_Entity);
     }

    public async add_student ( student : Student , posts:string[] )
     {
        let query_runner= AppDataSource.createQueryRunner();
        try{
            await query_runner.connect();
            await query_runner.startTransaction();
            let student_entity:Student_Entity = await query_runner.manager.save( Student_Entity , student);

            console.log( student_entity );

            if( posts.length > 0 )
            {
                let posts_db = new Posts_Db();
                let res = await posts_db.add_post_util(query_runner ,posts, student_entity);
                if ( res instanceof Error)
                {
                    throw new Error ( 'ERRO WHILE INSERTING THE POSTS');
                }
            }

            await query_runner.commitTransaction();
        }
        catch ( err : any)
        {
            await query_runner.rollbackTransaction();
            console.log( err.message);
        }
        finally
        {
            console.log( 'closing the query runner');
            await query_runner.release();
        }
    }

    public async get_student_by_id ( student_id: number )
     {
        try{
            let student_entity:Student_Entity|null = await this.student_repo.findOne({
                where : {
                    id : student_id
                },
                relations :
                {
                    posts: true
                }
                
            });
            if( student_entity == null )
            {
                throw new Error ('NO RECORD FOUND');
            }
            console.log( student_entity );
            let posts  =  student_entity.posts;
            // console.log( posts_entity.length);
            for( let post of posts){
                console.log( post.id ,post.title , post.student_id);
            }
        }
        catch ( err : any)
        {
            console.log( err.message);
        }
    }
    
    public async remove_student ( student_id : number)
    {
        try{
            let res  = await this.student_repo.delete( {
                    id : student_id
            });
            console.log ( res );
            return res;
        }
        catch ( err : any )
        {
            console.log( err.message);
        }
    }
}