//after executing the micro task queue next priority will be timer queue;
let { log }  = require('../MODULES/logger');

setTimeout(() => {
    log('setTimeout 1 ')
}, 0);

setTimeout( () =>
{
    log( 'setTimeout 3 ' )
    Promise.resolve().then(()=>log('promise function inside of the timer queue '));
} , 0 )

//for every callback function execution in the timer queue event loop check if any callbacks 
// in the microtask queue to be executed
setTimeout(() => {
    log('setTimeout 2 ')
    process.nextTick(()=> log (' next tick inside timeout queue') );
}, 0);


setTimeout(()=> log('setTimeout 3') ,100);
