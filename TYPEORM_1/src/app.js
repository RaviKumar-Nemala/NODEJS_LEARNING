let datasource  = require ('./config/db_config');


datasource.initialize().then ( ()=>
{
     console.log ('CONNECTED TO THE DB')
} , ( err)=> console.log (err.message));
