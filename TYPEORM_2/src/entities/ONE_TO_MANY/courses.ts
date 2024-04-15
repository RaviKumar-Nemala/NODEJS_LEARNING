import { Column, Entity, Generated, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : "courses"})
export  class CourseEntity 
{
    @Column( {
        primary : true,
        generated : "increment"
    })
    course_id:number 

    @Column( {
        unique : true ,
        type : "varchar",
        length : 255
    })
    course_name :string 
}