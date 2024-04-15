import {  AppDataSource} from '../config/db_config'
import {Student}from '../types/student'
import { Student_Db } from '../db/ONE_TO_MANY/student_db';
import { Posts_Db } from '../db/ONE_TO_MANY/posts_db';

class Student_Service
{ 
    private student_db:Student_Db;
    private post_db : Posts_Db;
    
    constructor()
    {
        this.student_db = new Student_Db();
        this.post_db = new Posts_Db();
    }
    
    async add_student ( student : Student , post_data :string[] ) 
    {
        
        let res = await  this.student_db.add_student(student , post_data);

    }

    async get_student_by_id ( student_id: number )
    {
        let res = await this.student_db.get_student_by_id(student_id);
        return res;
    }
    async remove_student( student_id : number )
    {
        let res = await this.student_db.remove_student(student_id);
        return res;
    }

    async add_post( student_id : number ,posts : string [])
    {
       let res =  await this.post_db.add_post(posts , student_id)
       console.log( res );
    }

    async remove_student_all_posts(student_id : number)
    {
        let res = await this.post_db.remove_student_all_posts(student_id);
        return res;
    }
}


AppDataSource.initialize().then(()=>
{
    console.log( 'database initialized successfully');

    let student_service= new Student_Service();
    // student_service.add_student({ name : 'ddos'},['post5' ,'post6']);
    // student_service.remove_student( 2 );
    // student_service.get_student_by_id(2);
    
    // student_service.add_post(2 , [ 'ravi_post','']);

    // student_service.remove_student_all_posts( 4);

    student_service.add_student({name :'ramu'} , ['ramu post', '']);

    student_service.add_student( { name : 'prudhvi'} ,[ 'prudhvi post1'] );
}
).catch ( (err:any)=>
{
    err.trace();
     console.log( err.message)
})