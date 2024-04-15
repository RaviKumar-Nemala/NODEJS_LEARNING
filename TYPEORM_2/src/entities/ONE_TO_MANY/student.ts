import { Entity,PrimaryGeneratedColumn , Column, OneToMany } from "typeorm"
import { Posts_Entity } from "./post"

@Entity( {name : "student"})
export class Student_Entity 
{      
     @PrimaryGeneratedColumn()
     id : number

     @Column( {name : "name" , type : "varchar" , length : 255 } )
     name : string

     @OneToMany( ()=> Posts_Entity , posts =>posts.student )
     posts : Posts_Entity[]
}