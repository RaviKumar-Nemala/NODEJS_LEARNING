let path = require('path');

let multer = require('multer');

let storage = multer.diskStorage(
    {
        destination : ( req , file , cb )=>
        {
             cb( null,  path.join(__dirname, '/STORAGE'));
        },
        filename :( req , file , cb)=>
        {
            const new_file_name = file.originalname + ' '+ Date.now().toString();
            cb( null,  new_file_name );
        }
    }
);
//file filtering and error callbacks 

let upload = multer(
    {
        storage : storage , 
        fileFilter : (req, file, cb) =>
        {
            console.log( file.originalname + ' ' + file.mimetype);

            cb( false,  true)    
        },
        limits : {
            fileSize : 1024*1024 
        }

    }
).any();

let upload_wrapper = ( req , res , next )=>
{
     upload( req , res  , (err)=>
     {
         if( err )
         {
             return next( err );
         }
         next();
     });
}

module.exports = upload_wrapper;
