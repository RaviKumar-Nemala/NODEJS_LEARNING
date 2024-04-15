class DataNotFoundError extends Error
{ 
    constructor( message )
    {   
        super( message);
        this.message = message;
        this.statusCode = 404;
        this.status = 'success'
    }
}
module.exports = { DataNotFoundError};