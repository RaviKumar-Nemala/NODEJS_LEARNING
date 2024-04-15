import { Entity , Column , PrimaryGeneratedColumn}  from 'typeorm';

@Entity( { name : "author"})
export class Author_Entity
{

    @PrimaryGeneratedColumn()
    id : number;

    @Column({
        name : 'name',
        type : "varchar",
        length : 256,
        unique : true
    })
    name : string;


}