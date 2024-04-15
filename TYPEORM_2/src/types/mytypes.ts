export interface Employee_Input
{
     name : string , 
     salary : number
}

export interface Employee_Dto extends Employee_Input
{
    emp_id : number 
}

