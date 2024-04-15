import { DataSource}  from 'typeorm';
import  path  from 'path';

export let AppDataSource : DataSource = new DataSource({
    type : 'mysql',
    username : 'root',
    password:'',
    database : 'video_streaming_check',
    host : 'localhost',
    port : 3306,
    synchronize: true,
    logging : true, 
    migrations : [path.resolve(__dirname, "../migration/**/*.ts")],
    entities : [path.resolve(__dirname , '../entities/*{.ts,.js}')],
})

console.log( AppDataSource);
