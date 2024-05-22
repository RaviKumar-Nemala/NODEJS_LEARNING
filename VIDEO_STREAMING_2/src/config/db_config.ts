import { DataSource}  from 'typeorm';
import  path  from 'path';

export let AppDataSource : DataSource = new DataSource({
    host : 
    port : 
    username : 
    database :
    password:  
    type :'mysql',
    migrations : [path.resolve(__dirname, "../migration/**/*{.ts,.js}")],
    entities : [path.resolve(__dirname , '../entities/**/*{.ts,.js}')],
    synchronize: true,
    logging : true,
})
console.log( AppDataSource);
