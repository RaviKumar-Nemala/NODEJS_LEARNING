import { AppDataSource  } from "../../config/db_config";
import { Repository } from "typeorm";
import { Author_Entity } from "../../entities/ONE_TO_ONE/author";
export class Author_Db 
{

    private author_repo : Repository<Author_Entity>;
    constructor()
    {
        this.author_repo = AppDataSource.getRepository( Author_Entity);
    }

    public async add_author ( name : string )
    {
        try{
            let res = await this.author_repo.insert (
                {
                     name : name 
                }
            );
            console.log( res );
        }
        catch ( err : any )
        {
            if( err.code == 'ER_DUP_ENTRY')
            {
                console.log( ' USER ALREADY FOUND');
            }
            else 
            {
                console.log( err.message)
            }
        }
    }
}