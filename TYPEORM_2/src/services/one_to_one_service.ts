import { AppDataSource } from "../config/db_config";
import { Author_Db } from "../db/ONE_TO_ONE/author_db";
import { Book_Db } from "../db/ONE_TO_ONE/book_db";

class One_To_One_Service
{
    private author_db : Author_Db ;
    private book_db : Book_Db ;
    constructor()
    {
        this.author_db = new Author_Db();
        this.book_db = new Book_Db();
    }

    public async add_book ( book_name : string , author_id : number )
    {
        await this.book_db.add_book(author_id , book_name );

    }

    public async add_author ( author_name : string  )
    {
        this.author_db.add_author( author_name );
    }

}

AppDataSource.initialize().then ( ()=>
{
    console.log( 'connected to the database ');
    let service  = new One_To_One_Service();
    // service.add_author( 'ravi');
    // service.add_author( 'kumar');

    service.add_book('new book' , 1 );
    // service.add_book('kumar book' , 6 );


}).catch ( (err) =>
{
    console.log( err.message) ;
})