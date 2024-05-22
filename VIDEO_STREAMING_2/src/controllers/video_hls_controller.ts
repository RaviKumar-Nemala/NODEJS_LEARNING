import  { s3_client , cloud_front_client } from './video_controller'
import  { v4 as uuid } from 'uuid';
import { Video_Controller } from './video_controller'
import  fs from 'fs';
import { exec } from 'child_process'
import  ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import util   from 'util';
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
import path from 'path';

const resolutions = [
    { width: 640, height: 360, bitrate: '750k' },
    { width: 850, height: 480, bitrate: '1000k' },
    {width : 1280 , height : 720 , bitrate :'2500k'},
    { width: 1920, height: 1080, bitrate: '4500k' },
];


function get_temp_folder_name ( )
{
     return uuid();
}

function createMasterPlaylist(masterPlaylistPath:string, variant_playlists:any[],output_dir:string)
{
    let masterPlaylistContent:string = '#EXTM3U\n';

    // Add variant playlist entries to master playlist
    variant_playlists.forEach((variant, index) => {
        const { resolution, bitrate, playlistPath } = variant;
        masterPlaylistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bitrate},RESOLUTION=${resolution}\n`;
        masterPlaylistContent += `${path.relative(output_dir, playlistPath)}\n`;
    });

    // Write master playlist to file
    fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);

    console.log(`Master playlist created: ${masterPlaylistPath}`);
}

async function convertVideoToHlsUtil ( variant_playlists:any[]  , masterPlaylistPath:string ,inputFile :string , outputDir:string , master_id : string )
{
            let tasks : Promise<Function>[] = [] ;


            for ( let i = 0 ; i < resolutions.length ; i ++ )
            {
                tasks.push ( new Promise( (resolve:Function, reject:Function )=>
                {
                    const resolution = resolutions[i];
                    const { height , width , bitrate} = resolution;
                    const outputFilename = `${outputDir}/${master_id}_${height}p.m3u8`;
                    const scaled_height = Math.ceil( height/2)*2;
                    const ffmpegCommand = `ffmpeg -i ${inputFile} \
                    -vf scale="width=-2:height=${scaled_height}"\
                    -sc_threshold 0 -b:v ${bitrate} -maxrate ${bitrate} \
                    -hls_time 10 -hls_playlist_type vod -hls_segment_filename ${outputDir}/${master_id}_${height}p_%03d.ts \
                    ${outputFilename}`;
        
                // Execute FFmpeg command as a child process
                exec(ffmpegCommand, (error:any, stdout:any, stderr:any) => {
                    if (error) {
                        console.error(`Error converting to ${width}p: ${error.message}`);
                        reject( `Error converting to ${width}p: ${error.message}` )
                        return;
                    }
                    console.log( i );
                    variant_playlists.push(  { resolution : `${width}x${height}` , bitrate:bitrate ,  playlistPath:outputFilename})
                    console.log(`Conversion to ${height}p completed.`);
                    resolve(`Conversion to ${height}p completed.`)
                });
                 })
                )
            }

            let res = await Promise.all( tasks );
            
            console.log( res );
}

async function createFolder ( folder_path:string)
{
    return new Promise( (resolve , reject, ) => {
        fs.mkdir(folder_path , (err)=>
    {
         if(  err)
         {
            reject( err)
         }
         resolve( 'DIRECTORY CREATED SUCCESSFULLY')
    })
}
    );

}


async function convertVideoToHls( inputPath : string)
{
    const folder_name   = get_temp_folder_name() ;
    const output_dir_path = path.resolve(__dirname , '../temp_uploads/' , folder_name );
    console.log( output_dir_path);
    await createFolder( output_dir_path)
    const masterPlayListPath = path.join( output_dir_path ,'/',`${folder_name}.m3u8`);
    let variantPlaylists:any[] = [] ;
    await convertVideoToHlsUtil(variantPlaylists , masterPlayListPath , inputPath ,output_dir_path, folder_name);
    createMasterPlaylist(masterPlayListPath , variantPlaylists,output_dir_path);
    
    return  { output_dir_path , folder_name };
}
async function get_file_data( file_location:string)
{
    return new Promise<string>( (resolve, reject)=>
    {
        fs.readFile(file_location , { encoding :'base64'},(err, data)=>
        {
            if( err )
                reject( err );
            else 
            resolve( data );
    } )
    }
    );

}
async function   is_valid_file_location ( path:string )
{
    try{
    let stat_util = util.promisify(fs.stat);
    await stat_util(path);
    return true;
    }
    catch ( err )
    {
        return false;
    }
}
async function transfer_files_from_local_to_s3(bucket_name :string ,key:string , src_folder_location:string)
{
    const readdir_util =  util.promisify(fs.readdir);

    let files = await readdir_util ( src_folder_location );
    console.log( files);

    let tasks:Promise<any>[] = [] ;
        for( let curr_file of  files )
        {
        let curr_task = new Promise( async (resolve, reject)=>
           {
            try{
            let file_location = path.join(src_folder_location,'/',curr_file) ;
            if(!is_valid_file_location(file_location))
            {
                reject('INVALID FILE LOCATION');
            }

            let read_stream=  fs.createReadStream(file_location);
            let bucket_key =  key + curr_file;
            console.log( bucket_key);

            let metadata = await Video_Controller.upload_to_s3(bucket_name , bucket_key , read_stream);
            resolve( metadata);
            }
            catch ( err)
            {
                console.log( err);
            }
           }
           );
        tasks.push( curr_task);
        }
    
    let res = await Promise.all(tasks);
    console.log( res);
}

const init = async()=>
{
const input_path = 'C:/Users/ECS/Desktop/game_thrones_sample_mini_3.mp4';
// let { output_dir_path , folder_name   } =  await convertVideoToHls( input_path);
let video_controller= new Video_Controller();
const BUCKET_NAME = 'bucket.testing.videos';
let folder_name = 'b3f9bb09-5499-468d-9563-f75b7c53328e';
let output_dir_path = 'C:/Users/ECS/Desktop/NODE_LEARN/VIDEO_STREAMING_2/src/temp_uploads/b3f9bb09-5499-468d-9563-f75b7c53328e'
const Key = `videos/${folder_name}/`;
// let res = await video_controller.create_s3_folder(BUCKET_NAME, Key);
await transfer_files_from_local_to_s3(BUCKET_NAME,Key, output_dir_path);
// let data = await get_file_data(path.join(output_dir_path,`/` ,'b3f9bb09-5499-468d-9563-f75b7c53328e_360p_000.ts'))
// console.log( data);
}

init();
