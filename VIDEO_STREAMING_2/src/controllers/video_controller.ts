import { S3Client, GetObjectCommand  ,  PutObjectCommand , DeleteObjectCommand , HeadObjectCommand , DeleteObjectsCommand , ObjectIdentifier, ListObjectsCommand , ListObjectsCommandOutput, DeleteObjectsCommandInput} from "@aws-sdk/client-s3";
import { getSignedUrl as s3getSignedUrl}  from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as cloudfrontGetSignedUrl , getSignedCookies} from '@aws-sdk/cloudfront-signer'
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import  { v4 as uuid } from 'uuid';
import { createReadStream, createWriteStream , stat, readFileSync ,statSync ,readFile   } from 'fs'
import { async_handler } from "../utils/async_handler";
import { Request, Response , NextFunction} from 'express';
import { BucketDeleteParams} from '../types/my_types';
import stream  from 'stream';
import path from 'path';
import { Http_Request_Config, Video_Upload_Metadata , BucketParams}  from '../types/my_types'
import { send_request } from '../utils/send_request'
import { AxiosHeaders } from "axios";
import crypto from 'crypto';
import { S3 } from "aws-sdk";
const ACCESS_KEY =  "AKIAZI2LJDA5YEXY7MM6"
const SECRET_KEY =  "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"

// const MUX_ACCESS_KEY = 'dccd77c0-c067-4b98-912d-3f326c2bf020';
// const MUX_SECRET_KEY = 'WDGJNmiWuC+nKHWpSNa6Q+C3nlLn2PlvZl67Ld8cylAEuaKbvtjJeDF5bJiuZssFDKYX5EtVcb+';
//PROD KEYS

const MUX_ACCESS_KEY='d6af6535-fe6a-437d-b7f8-b3a676b558f0'
const MUX_SECRET_KEY='WgMhmHkRmZEiPUejQC4Hs0TLhvhVXWTFbqJJa8jN+5inCkfyP85i9VLvt5bUqxIL9fMKXzHedIP'

export const s3_client= new S3Client(
    {
        region: 'ap-south-1',
        credentials:
        {
            accessKeyId : ACCESS_KEY,
            secretAccessKey : SECRET_KEY,
        }
    }
)

export const cloud_front_client = new CloudFrontClient(
    {
        region:'global',
        credentials:
        {
            accessKeyId : ACCESS_KEY,
            secretAccessKey : SECRET_KEY,
        }
    }
);

export class Video_Controller
{   
    private accepted_mime_types:string[] = [ "video/mp4"]
    private max_file_size:number =  1024 * 1024*60;//60mb
    private PUT_OBJECT_EXPIRY_TIME : number = 20*60; //in terms of seconds
    private GET_OBJECT_EXPIRY_TIME:number  = 30*60;
    private MUX_ASSET_CREATION_URL = 'https://api.mux.com/video/v1/assets'
    private CLOUD_FRONT_END_URL = 'https://d16udxigumuzoj.cloudfront.net'
    private CLOUD_FRONT_KEY_PAIR_ID = 'K3C1F7Z09UQESY';
    private CLOUD_FRONT_DISTRIBUTION_ID = 'EVMIKI4WMFHP';
    private async get_putobject_url ( object_key :string , video_upload_metadata:Video_Upload_Metadata )
    {
        try{
        let { file_size , mime_type } = video_upload_metadata;
        let command = new PutObjectCommand(
            {
                Bucket : 'bucket.testing.videos',
                Key : object_key,
                ContentType : mime_type
            }
        );
        let url =  await s3getSignedUrl(s3_client , command ,{ expiresIn : this.PUT_OBJECT_EXPIRY_TIME });
        console.log( url );
        return url;
        }
        catch ( err )
        {
            throw new Error('SOMETING WENT WRONG WHILE CREATING THE SINGED URL');
        }
    }

    //retrive all the objects in the given bucket 
    async retrive_objects( bucket_name :string , prefix : string):Promise<ListObjectsCommandOutput|undefined>
    {
        let list_objects_params = 
        {
            Bucket : bucket_name,
            Prefix : prefix
        }
        let command = new ListObjectsCommand(list_objects_params);
        let res:ListObjectsCommandOutput = await s3_client.send ( command );

        console.log( res );
        // return res.Contents;
        return res;
    }
    get_upload_url = async_handler( async( req : Request ,res : Response , next : NextFunction)=>
    {
        const video_metadata : Video_Upload_Metadata =  req.body;
        let {mime_type , file_size} =  req.body;
        if ( this.accepted_mime_types.indexOf(mime_type) == -1) 
        {
            return res.status(400 ).json({ message : 'INVALID MEDIA TYPE'});
        }
        else if( file_size <= 0 && file_size > this.max_file_size )
        {
            return res.status(400).json({message:'FILE SIZE SHOULD NOT EXCEEDED THAN 60MB'});
        }
        const ext = mime_type.split('/')[1];
        let file_name = uuid () ; 
        let object_key = `uploads/${file_name}.${ext}`;
        console.log( object_key);
        let url  = await this.get_putobject_url( object_key , video_metadata);
        return res.status(200).json({ data :{ upload_url : url}});
    }
    ) 
    
    private async create_mux_asset_util ( object_access_url :string )
    {
        let headers:AxiosHeaders = new AxiosHeaders();
        headers.set('Content-Type', 'application/json');


        let config:Http_Request_Config  = {
             method  : 'post',
             url : this.MUX_ASSET_CREATION_URL,
             headers,
             auth : {
                username : MUX_ACCESS_KEY,
                password :  MUX_SECRET_KEY
             },
             data :
             {
                    input: [
                      {
                        url: object_access_url
                      }
                    ],
                    playback_policy: [
                      "public"
                    ],
                    encoding_tier: "baseline"
                  }
             }
        
            let res = await send_request( config);
             console.log( res );
        
    }
    create_mux_asset = async_handler( async( req:Request , res:Response, next: NextFunction )=>
    { 
        let { bucket_key}  = req.body;
        console.log( bucket_key);
        let command = new GetObjectCommand( {
            Bucket : 'bucket.testing.videos',
            Key : bucket_key
        });

        let url  = await s3getSignedUrl( s3_client , command, { expiresIn : this.GET_OBJECT_EXPIRY_TIME});
        
        console.log ( url )  ;

        // await this.create_mux_asset_util( url );
        return res.status(200).json({ message : 'SUCCESSFULLY CREATED MUX ASSET'});
        
    })
    //returns the rsa private _key 
    get_private_rsa_key( ):string 
    {
        let file_path =   path.join('C:/Users/ECS/Desktop/private_key.pem');
        let data:string = readFileSync(file_path , 'utf8' );
       
        console.log( data );
        return data;

    }
    public async get_object_signed_url_util(bucket_key :string)
    {
        console.log( bucket_key);
        const private_key = this.get_private_rsa_key();
        let expiry_date = new Date( Date.now() + 1000*60*60).toString();
        console.log( expiry_date);
        let signed_url =  cloudfrontGetSignedUrl({
            url : this.CLOUD_FRONT_END_URL + "/" + bucket_key,
            privateKey:private_key,
            keyPairId: this.CLOUD_FRONT_KEY_PAIR_ID,
            dateLessThan: expiry_date
        })
        console.log(signed_url);
        return signed_url;
    }
    get_object_signed_url = async_handler( async(req:Request, res: Response, next:NextFunction)=>
    {
        let { bucket_key } = req.body;
        let signed_url = await this.get_object_signed_url_util( bucket_key )
        console.log( signed_url);
        return res.json({
            data : signed_url
        });
    }
    )

    get_object_signed_cookies = async_handler( async( req :Request, res : Response, next:NextFunction)=>
    {
        const { bucket_key } = req.body ;
        const private_key =  this.get_private_rsa_key();
        const expiry_date = new Date(Date.now() +  1000*60*10).toString();
        
        let cookies = getSignedCookies(
            {
                url : this.CLOUD_FRONT_END_URL + "/" + bucket_key,
                privateKey : private_key,
                dateLessThan : expiry_date,
                keyPairId:this.CLOUD_FRONT_KEY_PAIR_ID
            }
        );
        console.log( cookies );
        res.cookie("CloudFront-Key-Pair-Id" , cookies["CloudFront-Key-Pair-Id"] , {
            expires:new Date(expiry_date),
            httpOnly:true,
            sameSite:false,
            domain : '.cloudfront.net'
        });
        res.cookie( 'CloudFront-Signature' , cookies["CloudFront-Signature"] , {
            expires:new Date(expiry_date),
            httpOnly:true,
            sameSite:false,
            domain : '.cloudfront.net'
        })
        res.cookie( "CloudFront-Expires" , cookies["CloudFront-Expires"],
        {
            expires : new Date(expiry_date),
            httpOnly:true,
            sameSite:false,
            domain : '.cloudfront.net'
        });
        return res.json ( { message : 'COOKIES ARE SENT'});
    })

    public static async upload_to_s3(bucket_name:string, key:string, data:stream.Readable|string)
    {
        let command = new PutObjectCommand(
            {
                Key :key,
                Bucket : bucket_name,
                Body : data,
                ContentType : 'video/mp4'
            }
        );

        let { $metadata } = await s3_client.send( command);
        return $metadata;
    }
    //for sake of simplicity we are using the file in the local system
    //instead of configuring the multer get the file from the client
    upload_direct = async_handler( async( req : Request, res : Response, next: NextFunction)=>
    {
        let file_path = 'C:/Users/ECS/Desktop/hd_video.mp4';
        const { bucket_name } = req.body;
        const bucket_key =  'uploads'+ "/"+ uuid();
        let file_stream = createReadStream(file_path , { highWaterMark:40_000});
        file_stream.on('end' , ()=>
        {
            console.log('stream ended');
        });
       let file_details  =  statSync(file_path);
        console.log( file_details);
        const bucket_params = 
        {
            Bucket : bucket_name,
            Key : bucket_key,
            ContentType:'video/mp4',
            ContentLength : file_details.size,
            Body : file_stream,
        }
        let command = new PutObjectCommand(bucket_params);

        const result = await s3_client.send(command);

        const status_code = result.$metadata.httpStatusCode ;
        console.log( status_code ) ;
        
        return res.json({ message:'checking'});
    })
    
    private create_bucket_params( obj : BucketParams)
    {
        let { Bucket, ContentLength , Key , ContentType , Range} = obj;
        
        let res:BucketParams = {Bucket , Key };

        if( Range )
        {
            res.Range =  Range;
        }
        if( ContentLength != undefined)
        {
            res.ContentLength = ContentLength;
        }
        if (ContentType)
        {
            res.ContentType = ContentType       
        }

        console.log( res );
        return res;
    }
    async get_video ( Bucket :string, start_range:number ,end_range:number,content_type:string)
    {
        console.log( start_range , end_range );
        let ContentLength = end_range  - start_range + 1 ;
        let ContentType  = 'video/mp4' ;
        let Range = `bytes=${start_range}-${end_range}`; 
        let Key = 'uploads/1a8e9643-6e96-4428-81ff-fbcccb7438d4';
        let bucket_params =  this.create_bucket_params( {Bucket,ContentLength,ContentType,Range, Key});

        let command = new GetObjectCommand(  bucket_params );

        let data = await s3_client.send( command );

        let { Body , $metadata } =  data;
        console.log( $metadata , Body );
        return { Body : Body , statusCode :  $metadata.httpStatusCode};

    }
    stream_samle_hls_video = async_handler(async( req:Request, res:Response, next:NextFunction)=>
    {
        
    })
    stream_sample_video = async_handler( async (req:Request, res:Response,next:NextFunction)=>
    {


        //this file was initally send to the  s3 bucket so the size of this file
        //is equal to the file size of the file stored in the s3 
        let file_path = 'C:/Users/ECS/Desktop/hd_video.mp4';
        let file_details  =  statSync(file_path);
        let VIDEO_SIZE= file_details.size;
        let range:string|undefined = req.headers.range;
        let chunk_size = 10000;// 1mb
        if( range == undefined)
        {
            return res.status(500).json({message:'INVALID RANGE HEADER'});
        }
        let start:number = Number.parseInt(range.replace(/\D/g, ""));
        let end =  Math.min( start+ chunk_size , VIDEO_SIZE -1 );
        let content_size = end-start + 1 ; 
        let Bucket = 'bucket.testing.videos'
        console.log( start, end , content_size);

        let { Body , statusCode} = await this.get_video(Bucket, start, end ,'video/mp4');
        
        if( !statusCode  )
        {
            return res.status(400).json({message : 'error while fetching the resource'});
        }

        res.writeHead(204, {
            'Content-Range' : `bytes ${start}-${end}/${VIDEO_SIZE}`,
            'Accept-Ranges' : 'bytes',
            'Content-Length' : content_size,
            'Content-Type' : 'video/mp4'
        });

        (Body as stream.Readable).pipe( res)

    })

    stream_init = async_handler( async(req:Request , res :Response , next: NextFunction)=>
    {
            return res.sendFile(path.join(__dirname, './video_3.html')); 
    }
    )

    start_hls_stream = async_handler( async (req:Request,res:Response,next:NextFunction)=>
    {
        console.log( 'called');
        const { folder_name  , file_name } = req.params;
        // console.log( partial_bucket_key);
        const bucket_key = 'videos/'+folder_name + '/' + file_name;
        console.log( bucket_key );
        // return res.json({ message : 'checking'});
        let signed_url = this.get_object_signed_url_util(bucket_key); 
        console.log( signed_url);
        return signed_url;
    }
    )

    public async is_folder_available ( bucket_name :string , folder_name : string )
    {
        try{
            let bucket_params = 
            {
                Bucket : bucket_name ,
                Key : folder_name
            };
            console.log( bucket_params);
            let command = new HeadObjectCommand( bucket_params );
            //if the folder is available then it returns the 200 status along with the Bucket and the Key
            //if the folder is not available then it returns the 404 status
            let res = await s3_client.send( command );
            console.log ( res.$metadata );
            return true;
            }
            catch ( err : any)
            {
                 console.log ( err)
                 return false;
            }
    }
    public async create_s3_folder ( bucket_name : string , folder_name:string )
    {   
        let folder_availability_status = await this.is_folder_available( bucket_name , folder_name);
        if( folder_availability_status )
        {
            return { message :'FOLDER ALREADY AVAILABLE'}
        } 
        let command =  new PutObjectCommand(
            {
                Bucket : bucket_name,
                Key:folder_name
            }
        )
        let res = await s3_client.send( command );
        console.log( res.$metadata);
        
    }
    async remove_folder_from_cloud_front ( folder_name:string)
    {
        let invalidation_params ={
            DistributionId : this.CLOUD_FRONT_DISTRIBUTION_ID,
            InvalidationBatch : {
                CallerReference : `${Date.now()}`,
                Paths : {
                    Quantity :1 ,
                    Items : ["/"+ folder_name + "/*"]
                }
            }
        }
        console.log( invalidation_params);
        let command = new CreateInvalidationCommand(invalidation_params);

        let res = await cloud_front_client.send( command );
        console.log( res ) ;
        console.log( 'CLOUD_FRONT_METADATA = ' , res.$metadata );

    }
    async remove_from_cloud_front( bucket_keys:string[])
    {
        bucket_keys =  bucket_keys.map( (key)=> "/" + key );
        console.log( bucket_keys);
        if( bucket_keys.length ==0)
        {
            return;
        }

        let invalidation_params ={
            DistributionId : this.CLOUD_FRONT_DISTRIBUTION_ID,
            InvalidationBatch : {
                CallerReference : `${Date.now()}`,
                Paths : {
                    Quantity : bucket_keys.length,
                    Items : bucket_keys
                }
            }
        }
        console.log( invalidation_params);
        let command = new CreateInvalidationCommand(invalidation_params);

        let res = await cloud_front_client.send( command );
        console.log( res ) ;
        console.log( 'CLOUD_FRONT_METADATA = ' , res.$metadata );

    }
    delete_s3_object = async_handler( async( req:Request, res:Response,next:NextFunction)=>
    {
       let delete_params:BucketDeleteParams  = req.body;
       let { bucket_name , bucket_key } = delete_params;

        if( (!bucket_name) || (!bucket_key) )
        {
            return res.status(404).json({message:'OBJECT NOT FOUND'});
        }
        //using the default bucket name
        let command = new DeleteObjectCommand(
            {
                Bucket : bucket_name,
                Key : bucket_key
            }
        );
        
        let result = await s3_client.send(command);
        await this.remove_from_cloud_front([bucket_key])
        // console.log( 'S3_METADATA ='  , result.$metadata.httpStatusCode);
        return res.json({ message : 'OBJECT DELETED SUCCESSFULLY'});
    })

}

const command = new  GetObjectCommand({
    Bucket : 'bucket.testing.videos',
    // Key : 'home_pg.png',
    // Key : 'uploads/b08f2b18-46a5-4ec3-a2b0-643ecf0ce95f',
    Key : 'home_pg.png',
    Range:'bytes=0-10000' //used for getting the large object in terms of chunks
});

const video_controller = new Video_Controller();
video_controller.get_object_signed_url_util('videos/b3f9bb09-5499-468d-9563-f75b7c53328e/b3f9bb09-5499-468d-9563-f75b7c53328e.m3u8')
// video_controller.create_s3_folder('bucket.testing.videos','uploads/');

// video_controller.get_private_rsa_key();

async function delete_folder(){
//retrives all the files which are starts from the uploads
let files:ListObjectsCommandOutput | undefined = await video_controller.retrive_objects('bucket.testing.videos','uploads');
if ( files == undefined)
{
    return;
}
if ( files.Contents === undefined)
    return;

let bucket_keys:ObjectIdentifier []  = [];
let bucket_keys_str:string[] = [];
for ( let obj  of files.Contents)
{
    if( obj.Key == undefined) continue; 

    bucket_keys.push( { Key :  obj.Key})
    bucket_keys_str.push( obj.Key );;
}

console.log( bucket_keys );

let delete_params:DeleteObjectsCommandInput = 
{
    Bucket :  'bucket.testing.videos',
    Delete : {
        Objects : bucket_keys
    }
}

let delete_command  = new DeleteObjectsCommand( delete_params)

let delete_result = await s3_client.send( delete_command );

//hardcoding the folder name
let delete_result_cloud_front = await video_controller.remove_folder_from_cloud_front('uploads');
console.log( delete_result);
}
// delete_folder();

// video_controller.get_video('bucket.testing.videos',0,16000,'video/mp4');

// }

// async function createPresignedUrl( )
// {
//     const _2_MINUTES = 60*2
//     let url = await s3getSignedUrl(s3_client , command , { expiresIn :  _2_MINUTES});   
//     console.log(url); 
// }


// async function storeData()
// {
//     let file_location = path.join(__dirname,'NEMALA_RAVIKUMAR_RESUME.pdf');
//     let data = readFileSync( file_location, 'utf8');
//     let extension = path.extname(file_location);
//     const uuid_val = uuid();
//     let put_command = new PutObjectCommand(
//         {
//             Bucket : 'bucket.testing.videos',
//             Key :`uploads/${uuid_val}`,
//             ContentType : 'application/pdf',
//             // ContentLength : data.length,
//         });
//     // console.log( put_command)
//     let url = await s3getSignedUrl(s3_client, put_command , { expiresIn :  10*60} );

//     console.log( url );
    
// }

async  function accessObject( )
{
    
    let response = await s3_client.send(command);
    console.log ( response);
    let { Body  , $metadata , ContentLength , ContentType,AcceptRanges} = response;
    console.log( $metadata , ContentLength , ContentType , AcceptRanges);
    let write_stream = createWriteStream(path.join(__dirname , 'home_pg.png') );
   (Body as stream.Readable).pipe( write_stream);    
}

// accessObject(  ) ;

// accessObject()
// createPresignedUrl()
// storeData();

// function create_rsa_keys ()
// {
//     let temp :string = "rsa";
//     let res = crypto.generateKeyPairSync(temp,{
//         modulusLength:4040,
//         publicKeyEncoding:
//         {
//             type :'pbcs1',
//             format : 'pem'
//         },
//         privateKeyEncoding:
//         {
//             type:'pbcs1',
//             format:'pem'
//         }
//     });
//     console.log( res.publicKey , res.privateKey);
// }
// create_rsa_keys();
// {
//     "Version": "2008-10-17",
//     "Id": "PolicyForCloudFrontPrivateContent",
//     "Statement": [
//         {
//             "Sid": "AllowCloudFrontServicePrincipal",
//             "Effect": "Allow",
//             "Principal": {
//                 "Service": "cloudfront.amazonaws.com"
//             },
//             "Action": "s3:GetObject",
//             "Resource": "arn:aws:s3:::bucket.testing.videos/*",
//             "Condition": {
//                 "StringEquals": {
//                     "AWS:SourceArn": "arn:aws:cloudfront::637423654971:distribution/EVMIKI4WMFHP"
//                 }
//             }
//         }
//     ]
// }