import multer from 'multer';
import { Request , Response , NextFunction } from 'express';
import fs from 'fs';

const memory_storage = multer.memoryStorage();
const ACCEPTED_VIDEO_FORMATS = ['video/mp4']
const upload = multer ( 
    {
        storage : memory_storage,
        fileFilter : ( req:Request , file , done )=>
        {
            console.log( file );
            if ( !file )
            done ( null , false);
            else
            {
                const mime_type = file.mimetype;
                if( ACCEPTED_VIDEO_FORMATS.indexOf( mime_type ) == -1)
                    done ( null, false);
                else 
                    done( null, true);
            }
        },
        limits:
        {
            fileSize : 1024 * 1024 * 100
        }
    }
).fields([{name :'video_file' , maxCount : 10} , { name:'video_file_2', maxCount:10}]);

export const upload_wrapper =  ( req : Request, res: Response, next : NextFunction)=>
{
    upload( req , res , (err)=>
    {   
        if ( err )
        {
            next ( err );
        }
        next();
    });
}