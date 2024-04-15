let { log }  = require('../MODULES/logger.js');
let fs = require('fs');

fs.readFile( __filename ,()=>
{
    log('file read function: ');
})
setTimeout(()=>
{
    log ( 'setTimeout function')
    fs.readFile( __filename ,()=>
{
    log('file read function: ');
})
} ,1)
setImmediate(()=>
{
    log ( 'set Immediate function')
});



fs.readFile( __filename ,()=>
{
    log('file read function: ');
})
setImmediate(()=>
{
    log ( 'set Immediate function')
});

