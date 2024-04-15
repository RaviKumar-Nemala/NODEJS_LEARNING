let typeorm = require( 'typeorm' );
let dotenv = require( 'dotenv' );
dotenv.config();
let path = require( 'path' );
let { User } = require( '../entities/user.js');

let datasource = new typeorm.DataSource( {
    host : process.env.DATABASE_HOST,
    port : process.env.DATABASE_PORT,
    username : process.env.DATABASE_USERNAME,
    password:  process.env.DATABASE_PASSWORD,
    type : 'mysql',
    synchronize: true,
    logging : true, 
    entities : [User],
})

console.log( datasource.metadataTableName)
module.exports = datasource