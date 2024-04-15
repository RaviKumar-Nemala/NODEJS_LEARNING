// import { logger  }  from './logger.js';
const db = require('./config.js');
const log = require('../logger.js');
let {DuplicateUserError} = require('./duplicateUser.js');
let  {NoDefaultFoundError} =require('./NoDefaultFoundError.js');
let { DataNotFoundError} = require('./dataNotFound.js');

class EmployeeRepo
{
    #GET_EMPLOYEE = 'SELECT * FROM EMPLOYEE ';
    #GET_EMPLOYEE_BY_ID = 'SELECT  * FROM EMPLOYEE WHERE ID = ? ';
    #INSERT_EMPLOYEE = 'INSERT INTO EMPLOYEE(NAME,SALARY) VALUES(?,?)';
    #DELETE_EMPLOYEE_BY_ID = 'DELETE FROM EMPLOYEE WHERE ID = ?';

    constructor()
    {

    }

    async add({ name , salary})
    {
        //incase of insertion we get the array of object only the first object contain usefule info 
        //second object will be set to undefined same applies for insert , delete , but not for select query
        try{
        let data = await db.query(this.#INSERT_EMPLOYEE, [name, salary]);
        log( data);
        log ( data[0].affectedRows );
        return data;
        }
        catch( error)
        {
            if( error.code == 'ER_DUP_ENTRY')
            {
                console.log('duplicate entry');
                throw new DuplicateUserError('THE USERNAME  IS ALAREADY EXISTS');
            }
            else if( error.code == 'ER_NO_DEFAULT_FOR_FIELD')
            {
                throw new NoDefaultFoundError('NAME OR SALARY SHOULD NOT BE EMPTY');
            }
            else
            {
                throw  new Error('something went wrong');
            }
        }
    }
    
    async  get( )
    {
        try{
        let [ data ] = await db.query(this.#GET_EMPLOYEE);
        // log( data );
        return data;
        }
        catch( err )
        {
            log(err.message);
        } 
    }

    async delete_by_id( id )
    { 

            let [ data] = await db.query(this.#DELETE_EMPLOYEE_BY_ID , [ id ] );
            log ( data.affectedRows);
            if ( data.affectedRows == 0 )
            {
                return new DataNotFoundError('EMPLOYEE NOT FOUND WITH THE GIVEN ID');
            }
            return;
    }

    async get_by_id( id )
    {
        
            let [ data] =  await db.query(this.#GET_EMPLOYEE_BY_ID , [ id ] ) ;

            if ( !data || data.length == 0 )
            {
                throw new DataNotFoundError('NO EMPLOYEE FOUND');
            }
            return data;   
    }
}

module.exports = EmployeeRepo;