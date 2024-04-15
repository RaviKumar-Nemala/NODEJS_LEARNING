const db = require('./db_config');


class FILE_REPO
{
    #ADD_FILE = 'INSERT INTO MY_FILES ( NAME , CONTENT, TYPE) VALUES(?,?,?)'
    #GET_FILE_BY_ID = 'SELECT NAME , CONTENT ,  TYPE FROM MY_FILES WHERE ID =  ?';

    constructor()
    {

    }
    
    async  addFile( {name , content,  type})
    {
        try
        {
            let [ data ] = await db.query( this.#ADD_FILE , [ name ,content, type]);
            console.log( data);
            return data;
        }   
        catch(  error )
        {
            throw new Error('SOMETING WENT WRONG WHILE INSERTIN  THE DATA');   
        }
    }

    async  get_file_by_id  ( id )
    {
        let [ data ]  = await  db.query( this.#GET_FILE_BY_ID , [ id ] );
        
        console.log( data [ 0 ] );
        return data[0];
    }
}

module.exports = FILE_REPO;