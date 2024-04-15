
let asyncHandler = require('./asyncHandler');
let  FILE_REPO = require( './file_repo' );

let file_repo = new FILE_REPO();

class FILE_CONTROLLER{
    constructor()
    {

    }

    upload_file =  asyncHandler ( async ( req , res , next )=>
{
    // console.log( req.files);
    for( let curr_file of req.files){
    let obj  = { name : curr_file.originalname , type : curr_file.mimetype , content : curr_file.buffer} ;

    console.log( obj);
    
    await file_repo.addFile( obj )   

    }
    return res.json ( { message : 'FILE INSERTED SUCESSFULLY'});
})


    get_file_by_id = asyncHandler ( async ( req, res, next )=>
{
    let { id } =  req.params;
    id = Number(id);

    if ( !id )
    {
        throw new Error('INVLAID ID NUMBER');
    }

    let data = await file_repo.get_file_by_id( id );
    console.log( data);

     res.writeHead(200 , 
        {
            'Content-Type': data.TYPE
        })
    return res.end( data.CONTENT );
})

}

module.exports =  FILE_CONTROLLER;