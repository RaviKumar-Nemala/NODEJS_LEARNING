let multer = require('multer');
let fs = require('fs');
let storage = multer.memoryStorage();

//using this function for writing the binary data
function writeFile ( path , data )
{
    fs.writeFile( path , data, ( err)=>
    {
         if (err)
         {  
            console.log( 'error while writing the file')
         }
         else
         {
            console.log( 'data written into file');
         }
    });
}

const ACCEPTED_FORMATS = [ 'image/jpeg', 'image/png', 'image/gif', 'image/jpg']

let upload_in_memory =  multer( 
    {
         storage : storage,
         limits : {
             fileSize : 1024 * 1024*100
         },
         fileFilter :  ( req , file , cb )=>
         {
            if ( ACCEPTED_FORMATS.indexOf(file.mimetype) == -1 )
            {
                return cb( new Error('INVALID FILE TYPE ') ,false);
            }

            cb ( null , true);
         }        
    }
).fields({name:'f1',maxCount : 10},{ name : 'f2' , maxCount:1});

let upload_memo_wrapper =  ( req ,res , next)=>
{
        upload_in_memory( req , res  , ( err ) =>
        {
            if( err)
                return next( err)
            next();
        } );
}

module.exports = {upload_memo_wrapper, writeFile};