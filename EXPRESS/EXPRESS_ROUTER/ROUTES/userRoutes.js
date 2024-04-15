let { log } =  require('../LOGGER/logger.js');

let express = require('express');   

let router   =  express.Router();


//run this specific middleware function only when the path contains the param of userid

router.param('userId', (req, res, next, id) =>
{
     //defaulty all the  path varaiables are of string type

     //we have to manually convert it to our required type 

     log(id + '  '  +  typeof id);
    
     next( );
})
router.get('/',async ( req , res  , next )=>
{
      
})
router.get( '/getusers' , ( req , res ) =>
{
     log ( '/users endpoint');
     return res.status( 200 ).end('from get users')

})

router.get( "/add" ,  ( req ,res ) =>
{ 
     return res.status( 200).end( 'from add users');
})

router.get( '/getUsers/:userId' , ( req ,res ) =>
{
      return res.status(200).end('from get users with specified user id ');
})

module.exports = router;