let express= require('express');
const router = express.Router();
let { log } =  require('../LOGGER/logger');

router.get('/' ,  ( req,res )=>
{
    log('personal info /get method ');
    return res.status(200).end( 'get method of personal info');
})

router.post('/add', ( req, res)=>
{
     log('personal info add method ');
    return res.status( 200 ).end('post method of the personal info');
})

module.exports=  router;