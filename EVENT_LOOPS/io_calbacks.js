//setTimeout with 0 seconds cannot be guaranteed to get the more priority than the iocallbacks
let { log }  = require('../MODULES/logger.js');
let fs = require('fs');
let path = require('path');
setTimeout(() => {
    log('timeout callback')
}, 0);

// fs.readFile( path.join(__dirname , 'timer_queue.js') , 'utf-8' , (err,data)=>{
//         log ('file read function: ');
// }
// )

fs.readFile( __filename ,()=>
{
    log('file read function: ');
})


process.nextTick( () =>
{
    log('process tick function called')
});

Promise.resolve().then ( ()=> log ( 'promse 1' ) );

setTimeout( () => {
    log ( 'timeout function 1')
    process.nextTick( () => log ( ' nexttick function inside setTimeout' ) );
}
, 10);
setTimeout( () => {
    log ( 'timeout function 2')   
}
,10);
