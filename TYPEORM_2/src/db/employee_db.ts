import { InsertResult, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository ,In , And, Equal , Or } from "typeorm";
import { AppDataSource   } from "../config/db_config";
import { Employee } from "../entities/employee";
import { Employee_Dto, Employee_Input } from "../types/mytypes";

export class Employee_Db
{   
    private  employee_repo : Repository<Employee> ;
    private get_emp_repo():Repository<Employee>
    {
        return AppDataSource.getRepository(Employee);
    }
    constructor()
    {
        this.employee_repo = this.get_emp_repo();
    }

    async get_all_employees():Promise<Array<Employee_Dto>>
    {
        try { 
        let employee_list = await this.employee_repo.find();
        let employee_dto_list : Array<Employee_Dto> = [];
        for( let i = 0 ; i < employee_list.length ; i++ )
        {
            let { emp_id , name , salary } = employee_list[i];
            employee_dto_list.push( { emp_id , name , salary});
        }
        return employee_dto_list;
        }
        catch ( err :any )
        {
            console.log( err.message)
            err.trace();
            return [];
        }
    }

    async get_employee_by_id( emp_id : number ):Promise<Employee_Dto>
    {
        try 
        {
           let res =  await this.employee_repo.findOne(
                {
                    where : {
                        emp_id : emp_id
                    }
                }
            );
            if ( res == null )
            {
                throw new Error ('NO RECORD FOUND');
            }
            // let { emp_id , salary  , name } = res ;
            let emp_dto : Employee_Dto = res ;
            return emp_dto;
        }   
        catch ( err:any )
        {
            console.log ('CANNOT FOUND THE RECORD');
            throw err;
        }
    }
    async get_employees_lesser_salary( salary : number )
    {
        let res = await this.employee_repo.find(
            {
                select :{
                    emp_id : true ,
                    name : true ,
                    salary :true 
                },
                where : {
                    salary :LessThanOrEqual(salary)
                }
            }
        )
        return res;
    }
    async get_employees_greater_salary( salary : number )
    {
        let res = await this.employee_repo.find(
            {
                select :{
                    emp_id : true ,
                    name : true ,
                    salary :true 
                },
                where : {
                    salary :MoreThanOrEqual(salary)
                }
            }
        )
        return res;
    }
    async insert_employee( emp : Employee_Input) 
    {
        try {
    
        const emp_repo:Repository<Employee> = this.get_emp_repo();
        
        let response:InsertResult = await emp_repo.insert (
            {
                name : emp.name,
                salary : emp.salary
            }
        )

        console.log( response );
        return response;
        }

        catch ( err:any ) 
        {
            console.log( err.message );
        }
    }
    async get_employees_by_name_or_id( names : string[] , ids : number [] )
    {
        let res = await this.employee_repo.find(
            {
                where : [
                    {name : In(names )},
                    {emp_id : In( ids)}
                ],
                order : {
                    name :'DESC',
                    emp_id : 'ASC'
                },
                take : 10 ,
                skip : 0 
            }
        )
        return res;
    }

    async  get_employees_by_name_and_salary ( names : string[]  , salaries : number [])
    {

        //we can alson create the query builder using the AppDatasource
    let res = await this.employee_repo.createQueryBuilder('employee')
         .where('employee.emp_name = :name or employee.emp_name in (:names)',{name :'ravi' , names : names})
         .andWhere('employee.salary = :salary or employee.salary in (:salaries)',{salary : 1999 , salaries : salaries})
        .getMany();
    
    console.log( res )

        // let res =  this.employee_repo.find (
        //     {
        //          where :[
        //             {
        //              name : 'ravi',
        //             },
        //             {
        //                 name : In(names)
        //             }
        //          ],
        //     }
        // )

    }

    async remove_employee( id: number )
    {   
        try{
            //directly removes the record based on the conditions
            // let res1 = await this.employee_repo.delete({ emp_id  : id });
            // console.log( res1 );
            
            const employee:Employee_Dto = await this.get_employee_by_id( id );

            //if the record is in the memory 
            let res2  =await this.employee_repo.remove( employee  );
            
            console.log( res2 );

        }
        catch ( err:any )
        {
            console.log(err.message);
        }
    }
 
    async update_name( id : number , prev_name : string , upd_name : string )
    {
        try{
            let employee:Employee_Dto = await this.get_employee_by_id( id );
            employee.name = upd_name;
            let res = await this.employee_repo.save( employee );
            console.log( res );

            //this query updates the record and not return any of the record
            //instead it returns the query which is used
            // let temp = this.employee_repo.createQueryBuilder('employee')
            // .update()
            // .where('employee.emp_id = :emp_id and employee.emp_name = :name', { emp_id : id , name : prev_name})
            // .set({name : upd_name})
            // .execute()     

            // console.log( temp );
        }
        catch ( err:any )
        {
            console.log( 'erro occured')
            console.log(err.message);
        }
    }


}