import { AppDataSource } from "../config/db_config";
import { QueryRunner, Repository } from "typeorm";
import { User_Entity } from "../entities/user_entity";
import { User_Input } from "../types/my_types";
import { Api_Error } from "../errors/my_errors";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { Authority_Entity } from "../entities/authority_entity";
export class User_Db 
{
    private user_repo:Repository<User_Entity>;
    constructor()
    {
        this.user_repo = AppDataSource.getRepository(User_Entity);
    }
    async get_user_by_name( username : string )
    {
         let res = await this.user_repo.findOne({where : {username : username}});
        console.log( res);
         return res;
    }
    async add_role ( query_runner :QueryRunner , user_id:number , role: "USER" | "ADMIN")
    {
        let res = await query_runner.manager.save( Authority_Entity , { user_id: user_id, role: role});
        console.log( res);
        return;
    }
    async add_user( entered_data:User_Input )
    {
        let  duplicate_user = await this.get_user_by_name( entered_data.username );
        if ( duplicate_user != null )
        {
            throw new Api_Error('USER ALREADY EXISTS',400);
        }
        let query_runner:QueryRunner  = AppDataSource.createQueryRunner();
        try{
            await query_runner.connect();
            await query_runner.startTransaction();
            let res : User_Entity  = await query_runner.manager.save(User_Entity ,  entered_data );
            console.log( res );
            await this.add_role( query_runner, res.id , 'USER');
            await query_runner.commitTransaction();
            return res ;
        }
        catch (  err )
        {
            await query_runner.rollbackTransaction();
            throw new Api_Error( 'SOMETHING WENT WRONG WHILE INSERTING THE USER',400);
        }
        finally 
        {
            await query_runner.release();
        }
    }

    async remove_user()
    {

    }

    async get_user_by_id ( user_id : number  )
    {
        try{
            let user = await this.user_repo.findOne({ 
                where :
                {
                    id : user_id
                }
            });
            if ( user == null )
            {
                throw new Api_Error('USER NOT FOUND' , 404);
            }
            return user;
        }
        catch ( err )
        {
            throw err;
        }
    }
}