import { Entity , PrimaryGeneratedColumn , Column } from "typeorm";

@Entity( )
export class Employee
{
    @Column({
        name  : "emp_id",
        type : "int",
        primary : true, 
    }
    )   
    @PrimaryGeneratedColumn()
    emp_id : number
    
    @Column({ name : "emp_name" , type : "varchar" , length : 255 } )
    name : string 

    @Column ( { name : "salary" , type  :"decimal" , scale : 4 })
    salary : number 

}
