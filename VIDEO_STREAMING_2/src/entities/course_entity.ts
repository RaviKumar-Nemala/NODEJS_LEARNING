import { Entity , PrimaryGeneratedColumn , Column ,OneToMany, ManyToOne, JoinColumn, OneToOne} from 'typeorm'
import { User_Entity } from './user_entity';
import { Category_Entity } from './category_entity';
import { Course_Enrollments_Entity } from './course_enrollments_entity';
import {Course_Sections_Entity } from './course_sections_entity'

@Entity( { name : 'course'})
export class Course_Entity
{
    @PrimaryGeneratedColumn( 'uuid' )
    course_id : number;

    @Column({type :'varchar',length : 255,unique : true})
    course_title : string

    @Column({name : 'description', type : 'varchar',length : 255 , nullable : true})
    description : string
    
    @Column({name:'price',type :'decimal', precision : 5 , scale : 2  , nullable : true})
    price : number
    
    @Column({name :'is_published' , type : 'boolean' , default:false })
    is_published :boolean

    @Column({nullable : false, name : 'course_owner_id' })
    course_owner_id : number

    @Column( {type : 'varchar' , nullable : true  })
    category_id :string

    @ManyToOne(()=>User_Entity , user_entity=>user_entity.created_courses)
    @JoinColumn({name : 'course_owner_id'})
    course_owner : User_Entity;

    @ManyToOne(()=> Category_Entity , category_entity=>category_entity.courses)
    @JoinColumn({name:'category_id'})
    category : Category_Entity;   

    @OneToMany( ()=>Course_Enrollments_Entity , courses_enroll_entity=>courses_enroll_entity.course)
    course_enrollments : Course_Enrollments_Entity[]

    @OneToMany( () => Course_Sections_Entity, course_sections=>course_sections.course )
    course_sections:Course_Sections_Entity[]
}