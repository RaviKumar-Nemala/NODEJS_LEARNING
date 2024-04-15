import  { Entity , Column , PrimaryGeneratedColumn, OneToMany , OneToOne}  from 'typeorm';
import { User_Course_Entity } from './user_course_entity';
import { Authorities_Entity } from './authorities_entity';

@Entity({ name : 'user'})
export class User_Entity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { name : 'user_name' , type : 'varchar',length : 255})
    username : string;

    @Column( { name : 'password', type : 'varchar', length : 255})
    password:string
    
    @OneToMany( ()=> User_Course_Entity, user_course_entity=>user_course_entity.users)
    courses : User_Course_Entity[]

    @OneToOne( ()=> Authorities_Entity , auth=>auth.user )
    authority : Authorities_Entity
}