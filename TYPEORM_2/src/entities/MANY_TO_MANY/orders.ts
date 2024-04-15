import { Entity , Column , PrimaryGeneratedColumn , ManyToOne , JoinTable, JoinColumn, PrimaryColumn } from 'typeorm';
import { Customer_Entity } from './customer';
import { Product_Entity } from './products';

@Entity( { name : 'orders'})
export class Orders_Entity {

    
    @PrimaryColumn()
    product_id:number;

    @PrimaryColumn()
    customer_id: number;

    // @PrimaryColumn({type:'int' , name :'product_id'})
    @ManyToOne( ()=> Product_Entity , product_entity => product_entity.orders,{ nullable:false})
    @JoinColumn({name:'product_id'})
    products:  Product_Entity

    // @PrimaryColumn({type:'int', name : 'product_id'})
    @ManyToOne(()=> Customer_Entity , customer_entity  =>customer_entity.orders,{nullable:false})
    @JoinColumn({name:'customer_id'})
    customers:Customer_Entity
}