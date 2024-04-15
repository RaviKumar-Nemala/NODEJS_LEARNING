import { Entity , Column , PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Orders_Entity } from './orders';
@Entity( { name : 'products'})
export class Product_Entity
{   
    @PrimaryGeneratedColumn( )
    product_id : number ;

    @Column( { name : 'product_name', type : 'varchar' , length : 255 , unique : true})
    product_name: string

    @OneToMany( ()=> Orders_Entity , orders_entity => orders_entity.products)
    orders : Orders_Entity[]
}

