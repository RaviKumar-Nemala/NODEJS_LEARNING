import { User_Entity } from "../entities/user_entity";
import { AppDataSource } from "../config/db_config";
import { User_Input} from '../types/my_types'
import { User_Course_Entity } from "../entities/user_course_entity";
import { QueryRunner} from 'typeorm';
import {Authorities_Entity} from '../entities/authorities_entity'
import { Api_Error} from '../errors/my_errors';
export class User_Db{
    constructor( 
        private user_repo = AppDataSource.getRepository( User_Entity ),
        private user_course_mapper = AppDataSource.getRepository( User_Course_Entity)
     )
    {

    }

    async link_to_course( user_id : number , course_id:number )
    {
        try{
        let res = await this.user_course_mapper.insert(
            {
                user_id : user_id ,
                course_id : course_id
            }
        );
        console.log( res );
        }
        catch ( err:any )
        {
            if ( err.code == 'ER_DUP_ENTRY')
            {
                throw new Api_Error('USER ALRAEDY ATTACHED WITH THE COURSE',400);
            }
            else 
                throw new Error('SOMETHING WENT WRONG PLEASE TRY AFTER SOME TIME');
        }
    }
    public async get_user_with_authorites( username:string )
    {
        let user_entity = await this.user_repo.findOne(
            {
                where : {
                    username : username
                },
                relations:
                {
                    authority : true
                }
            }
        )
        if ( user_entity == null )
        {
            throw new Api_Error( 'USER NOT FOUND' , 404 );
        }
        return user_entity;
    }
    public async get_user_with_relations ( username:string)
    {
        let user_entity:User_Entity|null = await this.user_repo.findOne(
            {
                where:{
                    username:username
                },
                relations:{
                    authority:true,
                    courses :true
                }
            }
        );
        if ( user_entity == null )
        {
            throw new Api_Error('USER NOT FOUND WITH THE GIVEN NAME',404);
        }
        return user_entity;
    }
    public async get_user( username :string)
    {
        let user_entity:User_Entity|null = await this.user_repo.findOne(
            {
                where:{
                    username:username
                }
            }
        );
        if ( user_entity == null )
        {
            throw new Api_Error('USER NOT FOUND WITH THE GIVEN NAME',404);
        }
        return user_entity;

    }
    private async add_role ( query_runner : QueryRunner , role : string ,user_id : number )
    {

        let res = await query_runner.manager.insert(Authorities_Entity , {
            user_id : user_id ,
            role : 'USER',
        });

        console.log( res );
    }

    async add_user( user_input : User_Input )
    {   
        let query_runner = AppDataSource.createQueryRunner();

        try { 
        
        await query_runner.connect();

        await query_runner.startTransaction();

        let res = await this.user_repo.insert (
            {
                username: user_input.username,
                password: user_input.password
            }
        )
        
        console.log( res );

        await this.add_role( query_runner , 'USER', res.raw.insertId)
        
        await query_runner.commitTransaction();
        }
        catch (err : any )
        {
            query_runner.rollbackTransaction();
            console.log( err.message);
        }
        finally 
        {
            query_runner.release();
        }
    }
}