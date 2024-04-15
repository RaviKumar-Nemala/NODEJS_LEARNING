let express = require('express');
let multer = require('multer')
let app =  express();
let path = require('path');
let dotenv = require('dotenv');
dotenv.config();

let FILE_CONTROLLER = require('./DB/file_controller.js');

let file_controller = new FILE_CONTROLLER() ;

let upload_wrapper = require('./multer_2.js');
const {upload_memo_wrapper,writeFile} = require('./multper_3.js');

let storage =  multer.diskStorage({ 
    destination : ( req , file, cb )=>
    {
        //first value specifies the  error status second param specifies the path of the storage 
         cb( null ,  path.join(__dirname , '/STORAGE'));
    },
    filename  : ( req ,file ,cb )=>
    {
        console.log( file );
        const new_file_name  = Date.now().toString() + '_' + file.originalname;
        console.log( new_file_name);
        cb ( false , new_file_name);
    }
}
);

//simple way of doing it 
let upload_2 = multer( { dest : path.join(__dirname, '/STORAGE')});

//we use this approach inorder to customize the  filenames or file_filters etc;
let upload = multer( {storage :  storage } );


app.post('/upload', upload.single('myfile') , ( req , res , next ) =>
{
    // console.log( req.file);
    // let { name } = req.body;
    // console.log( name );
    return res.status( 200 ).json ('hell and heaven');
})

app.post( '/upload/new', upload_wrapper , (req,  res , next)=>
{   
    console.log( req.body );

    return res.status(200).json('from upload new api ');
} )

function transferFiles ( files )
{
     for ( let curr_file of files )
     {
         writeFile( path.join( __dirname , '/STORAGE', curr_file.orignalname) , curr_file.buffer);
        console.log( curr_file);
     }
}
app.post( '/upload/memory' ,upload_memo_wrapper,  ( req , res, next)=>
{   
    let files = req.files;
    // files.forEach( file => {  console.log( file) 
    //     writeFile( path.join( __dirname , 'STORAGE', file.originalname) , file.buffer);
    // }    );
    transferFiles( files );
     return res.status(200).json( 'FROM upload new memory');
})

app.post('/upload/mysql', upload_memo_wrapper, file_controller.upload_file)


app.get('/get_file/:id',file_controller.get_file_by_id)

app.listen( 3000, ()=> 
{
     console.log( 'listening on port 3000' );
})


app.use ( ( err , req, res , next ) =>
{
     console.log( err );
     return res.status( 500 ).json( { error : err.message || 'SOMETHING WENT WRONG' } );
})