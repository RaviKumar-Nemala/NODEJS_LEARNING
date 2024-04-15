import { Repository } from "typeorm";
import { AppDataSource } from "../../config/db_config";
import { Product_Entity } from "../../entities/MANY_TO_MANY/products";

export class Products_Db {

    private products_repo: Repository<Product_Entity>;

    constructor()
    {
        this.products_repo = AppDataSource.getRepository(Product_Entity);
    }

    public async add_product(name : string)
    {
        try {
             let res = await this.products_repo.insert(
                {
                    product_name : name 
                }
             )
             console.log( res );
        }
        catch ( err : any )
        {
            console.log( 'error triggered');
            console.log(err.message)
        }
    }

    public async get_product (name : string )
    {
        try 
        {
            let res = await this.products_repo.findOne(
                {
                     where :
                     {
                         product_name : name 
                     }
                }
            )
            console.log( res );
        }
        catch ( err: any )
        {
            console.log( err.message);
        }
    }
}