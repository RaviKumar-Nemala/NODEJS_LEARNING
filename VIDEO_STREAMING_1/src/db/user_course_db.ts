import { User_Course_Check} from '../types/my_types'
import { User_Course_Entity } from '../entities/user_course_entity'
import { AppDataSource} from '../config/db_config'
export class User_Course_Db
{
    constructor(private user_course_repo = AppDataSource.getRepository(User_Course_Entity) )
    {

    }

    //return true if the user_id and course_id is matching
    //or the requested user is of type admin 
    async check_user_attached_with_course ( data : User_Course_Check  )
    {   
        if ( data.role == 'ADMIN')
        {
            return Promise.resolve('COURSE IS LINKED BECAUSE ADMIN PRIVILAGES')
        }

       let res = await this.user_course_repo.findOne({
        where : [{
            user_id : data.user_id,
            course_id:data.course_id
        },{
            
        }]
       });
       if ( res == null )
       {
            throw new Error ( 'USER NOT REGISTERED WITH THE COURSE');
       }
       return res;
    }
}  