import { Course_Entity  } from "./course_entity";
import { JoinColumn,Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User_Entity } from "./user_entity"

@Entity({name:'course_enrollments'})
export class Course_Enrollments_Entity
{

    @PrimaryColumn()
    user_id : string 

    @PrimaryColumn()
    course_id:string 

    @ManyToOne(()=>Course_Entity , course_entity=>course_entity.course_enrollments)
    @JoinColumn({name :'course_id'})
    course : Course_Entity;

    @ManyToOne(()=>User_Entity , user_entity=>user_entity.enrolled_courses)
    @JoinColumn({name :'user_id'})
    user : User_Entity;

}