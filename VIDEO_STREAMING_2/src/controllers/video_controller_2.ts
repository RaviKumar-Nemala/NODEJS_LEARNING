import * as Aws from 'aws-sdk';
const ACCESS_KEY =  "AKIAZI2LJDA5YEXY7MM6"
const SECRET_KEY =  "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"
import { createWriteStream , createReadStream } from 'fs';
import  * as fs from 'fs';
import path from 'path'
let s3_config = { 
    Bucket : 'bucket.testing.videos',
    Key : 'home_pg.png'
}
let s3  = new Aws.S3({
    accessKeyId:ACCESS_KEY,
    secretAccessKey:SECRET_KEY
});

let read_stream = s3.getObject( s3_config   );

let write_stream = createWriteStream(path.join(__dirname ,'new_img.png'));
