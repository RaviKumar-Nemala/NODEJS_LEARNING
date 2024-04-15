import { Entity , PrimaryGeneratedColumn , Column ,OneToMany} from 'typeorm'
import { Video_Entity } from './video_entity';
import { User_Course_Entity } from './user_course_entity';

@Entity( { name : 'course'})
export class Course_Entity
{
    @PrimaryGeneratedColumn()
    course_id : number;

    @Column({
        type :'varchar',
        length : 255,
        unique : true
    })
    course_name : string
    
    @OneToMany( ()=> Video_Entity , video_entity=>video_entity.course)
    videos:Video_Entity[];

    @OneToMany(()=> User_Course_Entity , user_course_entity=>user_course_entity.courses)
    user_courses : User_Course_Entity[]
}