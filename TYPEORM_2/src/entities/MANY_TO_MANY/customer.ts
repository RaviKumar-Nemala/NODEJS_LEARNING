import { Entity , Column , PrimaryGeneratedColumn ,OneToMany} from 'typeorm';
import{ Orders_Entity } from './orders'

@Entity({ name  : 'customers'})
export class Customer_Entity
{
    @PrimaryGeneratedColumn()
    customer_id : number;

    @Column( )
    customer_name : string 

    @OneToMany(()=>Orders_Entity , orders_entity => orders_entity.customers)
    orders : Orders_Entity[]
}