
class DuplicateUserError extends Error
{
    constructor( message )
    {
        super( message);
        console.log( 'called duplicate user class');;
        this.statusCode = 400,
        this.status = 'fail',
        this.message = message;
    }
};

module.exports = {DuplicateUserError};
