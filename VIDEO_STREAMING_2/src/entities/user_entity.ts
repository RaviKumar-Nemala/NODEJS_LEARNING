import  { Entity , Column , PrimaryGeneratedColumn, OneToMany , OneToOne, PrimaryColumn, JoinColumn, ManyToOne}  from 'typeorm';
import { Authority_Entity } from './authority_entity';
import { Course_Enrollments_Entity } from './course_enrollments_entity';
import { Course_Entity } from './course_entity';

@Entity({ name : 'user'})
export class User_Entity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { name : 'user_name' , type : 'varchar',length : 255 , unique : true})
    username : string;

    @Column( { name : 'password', type : 'varchar', length : 255})
    password:string
    
    @OneToMany( ()=> Course_Enrollments_Entity, course_enrolls =>course_enrolls.user)
    enrolled_courses  : Course_Enrollments_Entity[]

    @OneToOne( ()=> Authority_Entity , auth=>auth.user )
    authority : Authority_Entity
    
    @OneToMany(()=> Course_Entity , course_entity => course_entity.course_owner)
    created_courses : Course_Entity[]
}