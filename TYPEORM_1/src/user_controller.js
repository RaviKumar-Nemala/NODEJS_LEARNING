let {User} = require('./entities/user.js');
let datasource = require('./config/db_config.js')
require("reflect-metadata")
datasource.initialize().then ( ()=>
{
     console.log ('CONNECTED TO THE DB')
} , ( err)=> console.log (err.message));



async function store_user ( username , salary ){

try{
let emp_repo = datasource.getRepository("user");
console.log ( emp_repo)
let res = await emp_repo.insert({
    username  : username,
    salary : salary
});
console.log( res );

}

catch ( err )
{
    console.log( err.message);
}

}

 store_user('ravi' , 898898);

//  store_user ( 'kumar' , 898455);
