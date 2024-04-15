//see the notes for  the order of execution of the event loop

//next tick queue having the more priority than the promise queue
let {  log } = require('../MODULES/logger.js');

log( 'normal execution');

process.nextTick( () => 
{
    log ('nexttick function1')    
}
);


process.nextTick( () => 
{
    log ('nexttick function2')  
    process.nextTick( () => 
{
    log ('inner nexttick function executed ')    
}
);
  
}
);

process.nextTick( () => 
{
    log ('nexttick function3')    
}
);


Promise.resolve().then( ()=>
{   
        log( 'promise funcion 1') 
})

Promise.resolve().then( ()=>
{   
        log( 'promise funcion 2') 
        Promise.resolve().then( () => {log('inner promise funcion') });
})

Promise.resolve().then( ()=>
{     log( 'promise funcion 3') 

})