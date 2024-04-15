let mysql = require('mysql2/promise');
// console.log( mysql );
// console.log( process );
//when we use the promise method then we could use the async await function inside 
//database qurery method which makes our code more clearner

const pool = mysql.createPool(
    {
        host : process.env.MYSQL_HOST,
        port : process.env.MYSQL_PORT,
        user :process.env.MYSQL_USERNAME,
        password:process.env.MYSQL_PASSWORD,
        database:process.env.MYSQL_DATABASE,
        connectionLimit: 10
    }
);

// console.log( pool );

// console.log( process.env.HOST + ' '  +  process.env.USERNAME + ' ' + process.env.PASSWORD);
module.exports = pool;