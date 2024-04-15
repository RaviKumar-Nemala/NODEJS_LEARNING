import { Video_Db } from "../db/video_db";
import { async_handler } from "../utils/async_handler";
import { Request , Response, NextFunction } from 'express';
import { Video_Input } from "../types/my_types";
import { Api_Error } from "../errors/my_errors";
import { Course_Entity } from "../entities/course_entity";
import { Course_Db } from "../db/course_db";
// import fs from 'fs';
import { createReadStream ,createWriteStream ,stat, statSync  } from "fs";
import { Duplex, PassThrough } from "stream";
import path from 'path';


export class Video_Controller
{

    private  static VIDEO_URL = 'C:/Users/ECS/Desktop/game_thrones_sample.mp4'
    private count =  0 ;
    constructor(private video_db:Video_Db = new Video_Db() ,
     private course_db:Course_Db = new Course_Db())
    {

    }

    private get_files ( req :Request , filed_name:string)
    {
        let multer_files = req.files as { [fieldname: string]: Express.Multer.File[] };

        let files : any  = [];
        for( let key of Object.keys(multer_files))
        {
            if ( key != filed_name)
                continue;
            let arr = Array.from(multer_files[key]);
            for( let file  of arr )
            {
                files.push( file);
            }
            break;
        }
        return files;
    }

    add_video = async_handler( async ( req:Request, res:Response , next:NextFunction )=>
        {
            console.log('INSIDE OF ADD_VIDEO METHOD');
            
            let { description , course_name  } = req.body;

            let course :Course_Entity|null = await this.course_db.get_course( course_name);

            if( course == null )
            {
                throw new Api_Error('INVALID COURSE NAME ' , 404 );
            }

        let files = this.get_files(req , 'video_file');

        if( files.length == 0 )
        {
            throw new Api_Error('file should not be empty');
        }

        let file = files [ 0 ] ;

            let video_input:Video_Input = 
            { 
                description : description , 
                filename : file.originalname,
                size : file.size , 
                content : file.buffer,
                mimetype:file.mimetype,
                course_id : course.course_id
            }
        
        console.log( video_input );
        let result = await this.video_db.add_video( video_input);
            
             return res.json( { success : true , data : 'INSERTED SUCCESSFULL'});
        })

    stream_video = async_handler ( async( req:Request, res:Response , next:NextFunction)=>
    {
        console.log( req.video_content);
        let video_content = req.video_content;

        if ( video_content == undefined)
        {
            return res.json('SOMETING WENT WRONG')
        }
        // let readStream = fs.createReadStream(video_content.content , { encoding : 'binary' , highWaterMark : 70_000});
        res.writeHead(206,
            {
                'Content-Type' : video_content.mime_type,
                'Content-Length' : video_content.size,   
            })

        res.end( video_content.content);
        
        // readStream.on('end' , ()=>
        // {
        //     console.log ('STREAM FINISHED');
        // })
        // readStream.on('data' ,(data)=>
        // {
        //     console.log( 'chunk completed');
        // })
        // readStream.on('error',(err)=>
        // {
        //     console.log('error occured while streaming ');
        // })

        // readStream.pipe(res);
    })

    stream_demo_video  = async_handler( async( req : Request, res : Response,  next: NextFunction)=>
    {
        let stats  = statSync( Video_Controller.VIDEO_URL); 
        const VIDEO_SIZE = stats.size;
        const VIDEO_MIME_TYPE = 'video/mp4';
        const CHUNK_SIZE = 10**6;
        let range:string|undefined = req.headers.range;

        if( range == undefined)
        {
            return res.status(404).write('RANGE HEADER NOT FOUND');
        }
        console.log( range );
        let start = Number ( range.replace(/\D/g, "") );
        console.log( 'start='+start );
        //make sure that we have to use the VIDEO_SIZE-1
        let end = Math.min(start + CHUNK_SIZE, VIDEO_SIZE -1 );


        let readStream=  createReadStream( Video_Controller.VIDEO_URL, { start , end });
        let contentLength  = end-start +1 ;
        const headers =  {
            'Content-Range' : `bytes ${start}-${end}/${VIDEO_SIZE}`,
            'Accept-Ranges' :'bytes',
            'Content-Length': contentLength,
            'Content-Type' : 'video/mp4'
        }
        res.writeHead( 206 , headers)
                
        readStream.pipe( res);
    })
}