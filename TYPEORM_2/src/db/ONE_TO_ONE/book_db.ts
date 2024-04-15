import { AppDataSource  } from "../../config/db_config";
import { Repository } from "typeorm";
import { Author_Entity } from "../../entities/ONE_TO_ONE/author";
import { Book_Entity } from "../../entities/ONE_TO_ONE/book";

export class Book_Db
{
    private book_repo : Repository<Book_Entity >;
    constructor()
    {
        this.book_repo = AppDataSource.getRepository(Book_Entity);
    }

    public async add_book ( author_id : number ,  name : string )
    {
        try
        {
            let res = await this.book_repo.insert(
                {
                    book_name : name , 
                    author_id : author_id
                }
            )
            console.log( res );
        }
        catch ( err: any )
        {
            if ( err.code == 'ER_DUP_ENTRY')
            {
                console.log( ' DUPLICATE BOOK NAME ')
            }
            else if (err.code == 'ER_NO_REFERENCED_ROW_2')
            {
                console.log ( 'CANNOT INSERT BOOK WITHOUT USERID');
            }
            else 
            {
                console.log(err.code)
            }
        }
    }
}