let { log }  = require('../MODULES/logger.js');
let fs = require('fs');

fs.readFile( __filename,()=>
{
    log('file read function outer scope: ');
})

setImmediate( ()=>
{
    log('set immediate called ' );
    fs.readFile( __filename,()=>
    {
        log('file read function: ');
    })
    setTimeout( ()=>
    {
        log('set timeout called ');
    },0);
    
    setImmediate( ()=> log('set immediate inner function: '));

    process.nextTick( ()=> { log ( 'process.nextTick called') } );
    Promise.resolve().then ( ()=> log ( 'promse 1' ) );
})

