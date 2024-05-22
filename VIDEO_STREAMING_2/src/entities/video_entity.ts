import { PrimaryGeneratedColumn , Entity ,  ManyToOne ,Column  , JoinColumn ,OneToOne } from  'typeorm'
import { Course_Sections_Entity } from './course_sections_entity'
import { Mux_Data_Entity } from './mux_data_entity'

@Entity('video')
export class Video_Entity
{
    
    @PrimaryGeneratedColumn('uuid')
    video_id : string;

    @Column({name :'video_url' ,type :'varchar'})
    video_url : string ;
    
    @Column({name :'video_title' ,type :'varchar'})
    video_title : string ;
    
    @Column({name:'section_id'})
    section_id :string

    //stores the size in terms of number of bytes
    @Column({name:'video_size'})
    video_size :number 

    @Column({type:'varchar' })
    mime_type:string

    @ManyToOne(()=>Course_Sections_Entity, course_sections_entity=>course_sections_entity.videos)
    @JoinColumn({name:'section_id'})
    course_section:Course_Sections_Entity;
}