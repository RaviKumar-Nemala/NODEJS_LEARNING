import { AppDataSource } from "../config/db_config";
import { Customers_Db } from "../db/MANY_TO_MANY/customers_db";
import { Products_Db } from "../db/MANY_TO_MANY/products_db";
import { Orders_Db } from "../db/MANY_TO_MANY/orders_db";

class Many_To_Many_Service
{
    private customers_db : Customers_Db ;
    private products_db : Products_Db ;
    private orders_db : Orders_Db ;
    constructor() 
    {
        this.customers_db = new Customers_Db();
        this.products_db = new Products_Db();
        this.orders_db = new Orders_Db();
    }
    public async add_customer( name : string )
    {
        await this.customers_db.add_customer( name );
    }
    public async get_customer( customer_id:  number)
    {
        await this.customers_db.get_customer( customer_id );
    }
    public async add_order( customer_id : number , product_id : number )
    {
        await this.orders_db.add_order( customer_id, product_id );
    }
    public async add_product(name : string)
    {
        await this.products_db.add_product(name );
    }
    public async get_product (name : string )
    {
        await this.products_db.get_product(name );
    }
}


AppDataSource.initialize().then (  () =>
{
    console.log ('connected to the database');
    let service  = new Many_To_Many_Service();
    
    // service.add_customer ( 'ravi');
    // service.add_customer('kumar');

    // service.add_product('asus');
    // service.add_product ('dell_laptop');
    // service.add_product('mac_laptop');

    service.add_order(23 , -3 );

})