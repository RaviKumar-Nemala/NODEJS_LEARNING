import { Entity, Repository } from "typeorm";
import { AppDataSource } from "../../config/db_config";
import { Orders_Entity } from "../../entities/MANY_TO_MANY/orders";

export class Orders_Db
{
    private orders_repo : Repository<Orders_Entity>;
    constructor()
    {
        this.orders_repo = AppDataSource.getRepository(Orders_Entity);
    }

    async add_order( customer_id : number , product_id : number )
    {
         try 
         { 

            let res = await this.orders_repo.insert(
                {
                    customer_id : customer_id,
                    product_id : product_id
                }
            );

            console.log( res );
         }
         catch ( err : any )
         {
            if( err.code == 'ER_DUP_ENTRY')
            {
                console.log ( 'duplicate entry')
            }
            else if (err.code == 'ER_NO_REFERENCED_ROW_2')
            {
                console.log ( ' no refernced row found in parent table');
            }
            else 
            {
                console.log(err.code)
            }
         }
    }

}