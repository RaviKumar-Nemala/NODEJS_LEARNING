let EventEmitter = require('events');
let  { log } = require('../MODULES/logger');

let eventEmitter = new EventEmitter();
eventEmitter.on('customevent' ,()=>
{
    log('customevent called')
})
eventEmitter.on('customevent' ,()=>
{
    log('customevent called 2 ')
})

eventEmitter.emit('customevent');

/*  EVET CAPTURE CODE SHOULD BE PLACE ABOVE THE EMIT FUNCTION THEN ONLY THAT CORRESPONDIG 

CAPTURED FUNCTION WILL BE EXECUTED */

function f1()
{
    //does not print anything
    eventEmitter.emit('c2');
    eventEmitter.on('c2' ,()=>
{
    log('customevent called 2 ')
})

}
//only one time event will be captured
function f2 ()
{
    eventEmitter.on('c3',()=> log ('customevent called 3') );
    eventEmitter.emit('c3');
    eventEmitter.on('c3',()=> log ('customevent called 3') );
}
f1();
f2();
