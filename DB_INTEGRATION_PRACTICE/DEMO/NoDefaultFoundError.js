class NoDefaultFoundError extends Error {

    constructor( message )
    {
        super(message);
        this.statusCode = 400,
        this.status = 'fail',
        this.message = message;
    }
}
module.exports = {NoDefaultFoundError};