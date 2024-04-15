import  { DataSource } from 'typeorm';
import  path  from 'path';

export const AppDataSource =  new DataSource(
    {
        host : process.env.DATABASE_HOST || 'localhost',
        port : Number(process.env.DATABASE_PORT ) || 3306,
        username : process.env.DATABASE_USERNAME|| 'root',
        database : process.env.DATABASE_NAME || 'typeorm_learn',
        password:  process.env.DATABASE_PASSWORD ||'thisandthatddosattacking',
        type :'mysql',
        migrations : [path.resolve(__dirname, "../migration/**/*{.ts,.js}")],
        entities : [path.resolve(__dirname , '../entities/**/*{.ts,.js}')],
        synchronize: true,
        logging : true,
    }
)

// console.log( AppDataSource)
