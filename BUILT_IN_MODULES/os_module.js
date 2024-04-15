let { log } = require ('../MODULES/logger.js')
let os = require ('os');

// log( os );//returns the several methods and propeties

log ( os.arch())//returns the cpu architecture

log( os.cpus() );

const freememory = os.freemem();//RETURNS THE FREE MEMORY IN THE RAM 

const freekb = freememory/1024;
const freemb = freekb/1024;
log( freekb + ' ' + ' kb');
log(freemb +' ' + ' mb ');

//converting in gb
log( Math.abs(freememory/Math.pow(1024,3) ) + ' ' + 'GB');


log ( os.uptime() );//retusn the total time in seconds from the last reboot of the system

log ( 'PLATFORM = ' + os.platform() );//returns the platform

log ( 'TYPE = ' + os.type());

log( 'RELEASE = ' + os.release() );

const totalMem = os.totalmem();
const totalMemGb = totalMem/( Math.pow(1024,3)) ;
log( 'TOAL PHYSICAL MEMORY = ' + totalMemGb + ' GB')
