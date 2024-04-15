let fs  = require( 'fs');
let { log } = require('../MODULES/logger.js');
//instread of using the readfile method by our selves we have the utility methods to do 
// that part and returns the promise back 

let util  = require('util');

// The util.promisify function in Node.js is a utility that converts a 
// callback-based function into a Promise-based function. 

let readFileUtil  = util.promisify (fs.readFile) ;


async function processFile (filePath) 
{
    try {
        let data = await readFileUtil(  filePath , 'utf-8');
        log( data ); 
    }
    catch (err) {
        log(err.message);
    }
}

processFile ( require('path').join(__dirname, 'new_file.txt'));

