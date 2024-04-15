import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Student_Entity  } from  "./student"

@Entity()
export class Posts_Entity
{
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     title: string;

     @Column()
     student_id : number;

     @ManyToOne( () => Student_Entity , student => student.posts , { onDelete :'CASCADE',onUpdate: 'RESTRICT'} )
     @JoinColumn({name : 'student_id'})
     student: Student_Entity;
     
    //this column is the place where the referece  of studenId store 
    //shold not change the column name ( if we want to retrive the posts based on the student)
     // @Column( )
     // studentId : number
}