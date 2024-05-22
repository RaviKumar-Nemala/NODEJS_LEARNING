import { Entity , JoinColumn , PrimaryColumn , Column , OneToOne}  from 'typeorm';
import { Video_Entity } from './video_entity'

@Entity('mux_data')
export class Mux_Data_Entity
{   
    @PrimaryColumn()
    video_id  : string 

    @OneToOne( ()=>Video_Entity , video_entity=>video_entity.video_id, {onDelete:'CASCADE' ,onUpdate:'RESTRICT'}) 
    @JoinColumn({name:'video_id'})
    video : string 

    @Column()
    asset_id:string

    @Column()
    playback_id:string
}