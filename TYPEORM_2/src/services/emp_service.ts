import { AppDataSource } from "../config/db_config";
import { Employee_Input , Employee_Dto } from "../types/mytypes";
import { Employee_Db } from "../db/employee_db";
import * as temp from "reflect-metadata";
import{ async_handler } from '../utils/async_handler'
import { NextFunction , Request , Response } from "express";

class EmployeeService
{
    private emp_db:Employee_Db;
    constructor()
    {
        this.emp_db= new Employee_Db();
    }

    public async insert_employee ( employee : Employee_Input )
    {
        if ( !employee.name )
        {
           console.log ( 'INVALID NAME ')
           return;
        }
        let res = await this.emp_db.insert_employee(  employee );
        
    }

    
//     public  get_all_employees = async_handler ( 
//         async ( req:Request , res:Response, next :NextFunction )=>{
//         let employee_details:Array<Employee_Dto> = await this.emp_db.get_all_employees();
//         console.log( employee_details );
//         return employee_details 
// }
//     )

        public async get_employees_by_name_or_id ( names: string[] , ids : number [])
        {
            try
            {
                let emp_list = await this.emp_db.get_employees_by_name_or_id( names ,ids );
                console.log( emp_list);
            }
            catch ( err:any )
            {
                console.log( err.message );
            }
        }
        public async  get_all_employees()
        {
        let employee_details:Array<Employee_Dto> = await this.emp_db.get_all_employees();
        console.log( employee_details );
        return employee_details    
        }

    public async get_employee_by_id (  emp_id:number )
    {
        let employee : Employee_Dto =await this.emp_db.get_employee_by_id(emp_id);
        console.log( employee );   

    }
    public async get_employees_lesser_salary ( salary : number )
    {
        let employees = await this.emp_db.get_employees_lesser_salary( salary);
        console.log( employees)
    }
    public async get_employees_greater_salary ( salary : number )
    {
        let employees_list = await this.emp_db.get_employees_greater_salary(salary);

        console.log( employees_list);
    }
    public get_employees_by_name_and_salary( names :string [] , salaries : number [])
    {
         this.emp_db.get_employees_by_name_and_salary( names , salaries);
    }
    public async remove_employee(id : number )
    {
        this.emp_db.remove_employee ( id );
    }   
    public async  update_employee(id: number , prev_name : string , upd_name : string)
    {  
        await this.emp_db.update_name ( id, prev_name ,upd_name );
    }
    public get_emp_details () 
    {

    }
    
}



AppDataSource.initialize().then (()=>
{
    console.log( 'database initialized successfully!');
    
    process.on( 'unhandledRejection' , ( reason )=> {
        console.log( reason);
    })

    let emp_service= new EmployeeService();
    // emp_service.get_employees_by_name_and_salary( ['kumar'] , [3999]);

    // emp_service.insert_employee( { name : 'kumar' , salary : 3999});
    // emp_service.insert_employee( { name : 'ddos' ,salary : 4000});

    // let req: Request , res : Response , next : NextFunction;

    // let employees = emp_service.get_all_employees();
    
    // emp_service.get_employee_by_id( 1 );
    // emp_service.get_employee_by_id(22);

    // emp_service.get_employees_greater_salary( 2000 );

    // emp_service.get_employees_lesser_salary ( 2000 );

    // emp_service.get_employees_by_name_or_id( ['ddos' , 'kumar'] , [ 1 ]);

    // emp_service.get_employees_by_name_or_id( [] , [ 1 , 2 ]);

    // emp_service.remove_employee( 3 );
    emp_service.update_employee( 1 , 'updated_ravi' , 'ravi');


}).catch ( ( err ) => console.log( err));