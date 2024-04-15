import { Repository } from "typeorm";
import { AppDataSource } from "../../config/db_config";
import { Customer_Entity } from "../../entities/MANY_TO_MANY/customer";


export class  Customers_Db 
{
    private customer_repo : Repository<Customer_Entity> ;
    
     constructor() 
     {
        this.customer_repo = AppDataSource.getRepository(Customer_Entity);
     }

     public async add_customer( name : string )
     {
        try{
         let res = await this.customer_repo.insert(
            {
                 customer_name : name
            }
         );
        console.log( res );
     }
     catch (  err : any )
     {
         console.log (  err.message);
     }
    }

    public async get_customer( customer_id:  number)
    { 
        try{
            let res = await this.customer_repo.findOne({
                where : 
                {
                    customer_id :  customer_id
                },
                relations :
                {
                     orders : true 
                }
            }
            );

            console.log( res );
            return res;
        }
        catch ( err : any )
        {
            console.log( err.message);
        }
    }
}