import { Entity ,ManyToOne ,OneToMany, Column  , JoinColumn, PrimaryGeneratedColumn} from 'typeorm';
import { Course_Entity } from './course_entity'
import { Video_Entity } from './video_entity'

@Entity({name:'course_sections'})
export class Course_Sections_Entity
{
    @PrimaryGeneratedColumn('uuid')
    course_section_id :string

    @Column( { name : 'section_name'})
    section_name :string 

    @Column({nullable: false })
    course_id:string

    @ManyToOne(()=>Course_Entity , course_entity=>course_entity.course_sections)
    @JoinColumn({name:'course_id'})
    course:Course_Entity;

    @OneToMany(()=>Video_Entity , video_entity=>video_entity.course_section)
    videos : Video_Entity[]
}