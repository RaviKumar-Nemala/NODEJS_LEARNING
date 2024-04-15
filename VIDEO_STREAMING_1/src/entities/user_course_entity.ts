import  { Entity , Column , PrimaryGeneratedColumn, OneToMany, PrimaryColumn, ManyToOne, JoinColumn}  from 'typeorm';
import { User_Entity } from './user_entity';
import  { Course_Entity } from './course_entity';

@Entity( { name : 'user_course_mapper'})
export class User_Course_Entity  
{
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    course_id: number;

    @ManyToOne( ()=> User_Entity , user=>user.courses )
    @JoinColumn( { name : 'user_id'})
    users:User_Entity;

    @ManyToOne( ()=> Course_Entity , course=>course.user_courses)
    @JoinColumn( { name : 'course_id'})
    courses:Course_Entity;
}