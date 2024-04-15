import { Entity , Column , PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Course_Entity } from './course_entity';

@Entity( { name : 'video'})
export class Video_Entity
{
    constructor()
    {

    }

    @PrimaryGeneratedColumn()
    id : number;

    @Column ({type : 'text'})
    description : string

    @Column ()
    filename:string ;

    @Column ( )
    size : number ;

    @Column ( { type : 'varchar',length : 256} )
    mime_type: string;

    @Column({type : 'longblob'})
    content:Buffer

    @Column()
    course_id : number 

    @ManyToOne( ()=> Course_Entity , course_entity=> course_entity.videos)
    @JoinColumn({name:'course_id'})
    course:Course_Entity;
}