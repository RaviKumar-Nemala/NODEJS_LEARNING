import { Entity , Column , PrimaryGeneratedColumn, OneToOne, JoinColumn}  from 'typeorm';
import { Author_Entity } from './author';
@Entity({name : 'book'} )
export class Book_Entity
{

    @PrimaryGeneratedColumn()
    book_id : number;

    @Column({
        name : 'book_name',
        type : 'varchar',
        length : 256
    })
    book_name: string

    @Column ()
    author_id : number;

    @OneToOne( ()=> Author_Entity , author => author.id)
    @JoinColumn({ name : 'author_id'})
    author: Author_Entity;
}
