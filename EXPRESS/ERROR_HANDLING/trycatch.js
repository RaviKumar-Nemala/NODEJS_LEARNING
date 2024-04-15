let trycatch = (controller) => ( req , res , next)=>
{
    try{
        controller();
    }
    catch ( err )
    {
        return next(  err );
    }
}
module.exports = trycatch;