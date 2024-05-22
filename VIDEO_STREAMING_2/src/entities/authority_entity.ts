import { Entity ,  Column ,JoinColumn,OneToOne, PrimaryColumn} from 'typeorm'
import { User_Entity  } from './user_entity'

@Entity({ name : 'authority'})
export class  Authority_Entity 
{
    
    @PrimaryColumn()
    user_id:number

    @Column ( {
        type:'varchar',
        length : 255,
        default : 'USER'
    })
    role : string 

    @OneToOne(()=>User_Entity , user=>user.authority)
    @JoinColumn({name:'user_id'})
    user : User_Entity
}
 
