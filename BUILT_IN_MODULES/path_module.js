let { log } = require ('../MODULES/logger.js')
let path = require('path')
log( path);

let filePath = path.join( 'BUILT_IN_MODULES' ,  'mytext.txt')
log( filePath);

let absPath =  path.join(__dirname, 'mytext.txt') ;

log( 'dir name ' + path.dirname(absPath));

if(path.isAbsolute(absPath))
{
    log('path is absolute');
}

log( 'baseName = ' + path.basename(absPath));

log( ' FILE EXTENSION = ' + path.extname(absPath) );


let pathObject = path.parse( absPath );

log( pathObject);

log( path.format( pathObject));

let absPath2 = path.resolve('BUILT_IN_MODULES','to','mytext.txt');

log(absPath2);

// Resolving 2 path-segments
// with the current directory
path1 = path.resolve("users/admin", "readme.md");
console.log(path1)
  
// Resolving 3 path-segments
// with the current directory
path2 = path.resolve("users", "admin", "readme.md");
console.log(path2)
  
// Treating of the first segment
// as root, ignoring the current directory
path3 = path.resolve("/users/admin", "readme.md");
console.log(path3)


//select the path of the file which is in the another folder
let temp =  "../EVENT_LOOPS/check_queue.js";

let pathVal = path.resolve( __dirname , temp);

log( pathVal )
