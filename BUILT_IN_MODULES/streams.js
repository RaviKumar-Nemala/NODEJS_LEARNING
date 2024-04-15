
//In Node.js, the fs module provides the createReadStream and
//createWriteStream functions to work with streams for reading and writing files. Streams in Node.js provide an efficient 
//way to work with data, especially when dealing with large files.

let fs = require('fs');

const {log} = require('../MODULES/logger');

let createBigFile = ( )=>
{
    for ( let  i = 0 ; i < 10000;  i ++)
    fs.writeFileSync('./bigFile.txt' ,`hello wordld ${i}\n`, {flag : 'a'});
}

let readFile  = () =>
{
    fs.readFile('./bigFile.txt', 'utf-8', (err, data) =>
    {
        log (data);
    })
}



function readByStream()
{
    //reads the data in the form of chunks 
    //default size of the each chunk of data = 64kb

    // let stream = fs.createReadStream('./bigFile.txt', 'utf-8' );

    let stream = fs.createReadStream('./bigFile.txt', { encoding : 'utf-8' , highWaterMark : 70_000} );

    //once the chunk is ready this event will be called
    stream.on('data', (data) =>
    {
        log( 'called' );
    })
    //after completion of entire reading of file
    stream.on('end', () =>
    {
        log('end');
    })
    stream.on('error', (err)=>
    {
        log( err.message);
    })
}


function pipeData()
{
    let readstream = fs.createReadStream('./bigFile.txt', { encoding : 'utf-8', highWaterMark : 10_000} );

    let writeStream = fs.createWriteStream('./writeFile.txt' , 'utf-8' );

    readstream.pipe( writeStream);
    
    readstream.on('data', ()=>
    {
        log('piping the block of data');
    }
    )
    writeStream.on('finish', () =>
    {
        log('finish');
    })
}

// createBigFile();
// readFile();

// readByStream();
pipeData();

