import { AppDataSource  } from '../../config/db_config'
import { Posts_Entity } from '../../entities/ONE_TO_MANY/post'
import {QueryRunner, Repository} from 'typeorm'
import { Student_Entity } from '../../entities/ONE_TO_MANY/student'

export class Posts_Db
{
    private  posts_repo : Repository<Posts_Entity> ;
    private student_repo : Repository<Student_Entity> ;
    constructor()
    {
        this.posts_repo = AppDataSource.getRepository(Posts_Entity);
        this.student_repo = AppDataSource.getRepository(Student_Entity);
    }

    public async add_post_util ( query_runner : QueryRunner, posts:string[] , student_entity : Student_Entity )
    {
        try{
        let total_posts : Posts_Entity[] = [];
        for( let i = 0; i < posts.length; i++ )
            {
                let post_entity = new Posts_Entity()
                if ( posts[i].length <= 1 )
                    throw new Error('check transaction is working or not ');
                post_entity.title = posts[i];
                post_entity.student_id = student_entity.id;
                total_posts.push( post_entity);
            }
        let res = await query_runner.manager.save(Posts_Entity , total_posts);
        return res;
        }
        catch ( err : any )
        {
            console.log( err.message);
            return err;
        }
    }
    public async remove_student_all_posts(student_id : number)
    {
        try{
        let res = await  this.posts_repo.delete({ student_id : student_id});
        console.log( res );
        }
        catch( err:any )
        {
            console.log( err.message);
        }
    }
    public async add_post( posts:string[] , student_id : number  )
    {
        let query_runner= AppDataSource.createQueryRunner();
        try{
            await query_runner.connect()
            await query_runner.startTransaction();
        let student_entity:Student_Entity|null =  await this.student_repo.findOne({
            where : 
            {
                id : student_id
            }
        }
        )

        if( student_entity == null )
        {
            throw new Error( 'cannot insert post with out student');
        }   
        let res = await this.add_post_util( query_runner,  posts ,student_entity);
        if ( res instanceof Error)
        {
            throw new Error('cannot insert post')
        }
        query_runner.commitTransaction();
        console.log( res );
        return res;
        }
        catch ( err : any )
        {
            query_runner.rollbackTransaction();
            console.log( err.message);
        }
        finally
        {
            query_runner.release()
        }
    }

}