let { log } = require ('../MODULES/logger.js')
let path = require('path')
let fs = require('fs');

let filePath = path.resolve('FILES' ,'./mycontent.txt');

log(filePath)

let splitText = ( txt )=>
{
    let res = txt.split('\r\n').map( (val , idx)=>
    {
        let [key,value]= val.split('=');
        // log( key + ' '  + value );
        return  { [key.trim()] :  value.trim()}  //correct syntax for creating the object with dynamic key
    } 
    );

    log( res );
}

//defualt behavior is asynchronous  
//we could use fs.readFileSync to read the file in synchronous mode

let readFileContent = ( path , operator = null )=>
{
    fs.readFile(path, 'utf-8', ( err , data) =>
    {
        if ( err )
        {
            log(err.message)
            return;
        }
        if ( operator == '=')
        splitText( data );
        else 
            log( data );
    })
}

readFileContent(filePath);

// readFileContent(path.resolve('mypdf.pdf'));

log( 'after readfileContent code ');//it will be executed before file output due to asynchronous nature


let writeFileContent = ( path, data )=>
{
    log( path);
    if( !fs.existsSync(path))
    {
        log('CREATING THE NEW FILE  AT ' + path);
    }

    fs.writeFile(path, data, 'utf-8', (err) =>
    {
        if (err)
        {
            log('error while writing file');
            return;
        }
        log('file written successfully');
    })
}

let appendFileContent = ( path , data )=>
{
    if( !fs.existsSync(path))
    {
        log('file does not exist cannot append the content');
        return;
    }
    fs.appendFile(path , data  , err =>
        {
            if (err)
            {
                log('error while appending file');
                return;
            }
            log('file appended successfully');
        })  

}
let mycontent =  "HELLO FROM NODE JS PROGRAM ";

log( filePath);

writeFileContent( filePath.replace('mycontent.txt' , 'hell.docs') , mycontent);//same true for the pdf files

// appendFileContent( filePath , '\nappended content');

//display the properties of the file using fs.stat function


let getFileProperties = function( filePath)
{
     fs.stat( filePath , ( err ,  stats) =>
     {
        if (err )
        {
            log( err.message);
            return;
        }
        if( stats.isDirectory())
        {
            log( path.basename(filePath) + ' is not a  directory' );
        }
        if ( stats.isFile( ) )
        {
            log( path.basename(filePath) +' is a file' );
        }
        log ( ' FILE SIZE = ' + stats.size);
        
     })
}

// getFileProperties( filePath);


//reading the directories 
let readDirContent = ( dirPath )=> {fs.readdir( dirPath , ( err,files) => 
{
    if( !path.isAbsolute(dirPath))
    {
         log('path is not absolute')
         return;
    }
    log( 'dir path = '  + dirPath );
    if ( err )
    {
        log(err.stack);
        return;
    }
    log( files );

    for ( let ele  of files )
    {
        console.log( ele );
        let absPath =  path.join(dirPath,ele);
        // log( absPath )
        fs.stat( absPath, ( err, stats)=>
        {
            if( err )
            {
                log ( err.message);  
            }
            else 
            {
                if ( stats.isDirectory() )
                {   
                    // log( absPath)
                    readDirContent( absPath );
                }
                if( stats.isFile())
                {
                    log( 'FILE NAME = ' + absPath + ' FILE SIZE =' + stats.size + ' FILE EXTENSION = ' + path.extname( absPath ) );
                }
            }
        })
    }
})}

let dirPath = path.join( __dirname );
log( dirPath);
readDirContent( dirPath);

return;

//creating the directories 

let createDir = ( dirPath )=>
{
    fs.mkdir( dirPath, (err) =>
    {
        if (err)
        {
            log(err.message);
            return;
        }
        log( dirPath +'created successfully');
    })
}
createDir( path.join( __dirname, 'newdir'));

//copy files from source directory to destination directory
let isDirectory = ( path ) =>
{
    try{
    return fs.statSync( path ).isDirectory() 
    }
    catch(err)
    {
        return false;
    }
}

let transferFiles  = ( srcPath , destPath )=>
{
    log( 'SOURCE FILE = ' + srcPath +  ' TO FILE = ' + destPath);

    if( fs.existsSync( destPath ) && isDirectory( destPath ) )
    {
        log('executed')
        // log( path.dirname(destPath) + ' ' + path.basename(srcPath));
        destPath  = ( path.join( destPath, path.basename(srcPath) ) );
    }
    log( 'dest path = ' + destPath );
     fs.copyFileSync(srcPath , destPath );

}
transferFiles( path.join(__dirname,'os_module.js') , path.join(__dirname,'FILES'));



//REMOVING THE FILES AND DIRECTORIES 



let removeDir = ( dirPath )=>
{
    fs.rmdir( dirPath, (err) =>
    {
        if (err)
        {
            log(err.message);
            return;
        }
        log( dirPath +'removed successfully');
    })
}

//remove file 

let removeFile = ( path )=>
{
    fs.unlink(path, (err)=>
    {
        if ( err)
        {
            log( err.message);
            return;
        }
        log( path + ' REMOVED SUCCESSFULLY');
    });
}

writeFileContent(path.join(__dirname , 'new_file.txt') , 'new Data ' )

removeFile( path.join(__dirname, 'new_file.txt') );

//RENAMING THE FILE NAMES ;

let renameFileOrDir = ( oldPath, newPath )=>
{
    fs.rename( oldPath, newPath, (err) =>
    {
        if (err)
        {
            log(err.message);
            return;
        }
        log( oldPath +'renamed to'+ newPath);
    })
}
