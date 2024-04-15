let { log }  = require('../MODULES/logger');
let { PassThrough, Duplex } = require('stream');

let { createReadStream , createWriteStream  } = require('fs')

class My_Tunnel extends Duplex
{
    constructor( delay )
    {
        super();
        this.delay = delay;
    }

    _read(size)
    {
        console.log( size );
    }
    
    _write(chunk ,  encoding, callback )
    {
        chunk = 'hell and heaven'
        this.push ( chunk)
        setTimeout(() => {
             callback();
        }, this.delay);
    }
    finish( )
    {
        this.push(null);
    }
}

try{
let mytunnel=  new My_Tunnel(1000);
let mypipe  = new PassThrough();

let readStream = createReadStream('./writeFile.txt' , { encoding : 'utf-8', highWaterMark : 60_000});

let writeStream = createWriteStream('./new_writeFile.txt');
let count = 0 ;
mypipe.on('data' , ( chunk )=>
{
    count ++;
    console.log( chunk.toString() + ' ' + chunk.length  );
})

readStream.pipe( mytunnel).pipe(mypipe).pipe(writeStream);

mypipe.on('end', ()=>{
    console.log( `count = ${count}` );
})
}
catch ( err )
{
    console.log( err);
}

// let  http  = require('http') ;
// const { create } = require('domain');

// let server = http.createServer( (req,res) =>
// {
//     let readStream = createReadStream('./bigFile.txt', {encoding:'utf-8' , highWaterMark : 20_000} );
//     readStream.pipe( res );
// }
// );

// server.listen( 3000, ()=>
// {
//     log('server is running on port 3000');
// } );

// let server2 = http.createServer( (req,res) =>
// {
//     let readStream = createReadStream('./bigFile.txt', {encoding:'utf-8' , highWaterMark : 20_000} );
//     readStream.pipe( res );
// }
// );

// server2.listen( 2000, ()=>
// {
//     log('server is running on port 3000');
// } );

