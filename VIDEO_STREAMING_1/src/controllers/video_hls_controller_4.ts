import { v4 as uuid } from 'uuid';
import fs from  'fs'

const ffmpeg = require('fluent-ffmpeg');

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const path = require('path')

const { exec } = require('child_process');

let variant_playlists:Object[] = [] ;
let master_id = uuid();
console.log( master_id);
function createMasterPlaylist(masterPlaylistPath:string, variant_playlists:any[])
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

function convertVideoToHLS(inputFile:string, outputDir:string) {
    // Define video resolutions and corresponding bitrates
    const resolutions = [
        { width: 640, height: 360, bitrate: '750k' },
        { width: 850, height: 480, bitrate: '1000k' },
        {width : 1280 , height : 720 , bitrate :'2500k'},
        { width: 1920, height: 1080, bitrate: '4500k' },
    ];
    const masterPlaylistPath = path.join(outputDir,`${master_id}.m3u8`);

        // { width: 1280, height: 720, bitrate: '2500k' },
        // { width  :426 , height : 240 , bitrate :'400k'}

    // Execute FFmpeg commands for each resolution
    resolutions.forEach((resolution, index) => {
        const { width, height, bitrate } = resolution;
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
                return;
            }
            
            variant_playlists.push(  { resolution : `${width}x${height}` , bitrate:bitrate ,  playlistPath:outputFilename})
            console.log(`Conversion to ${height}p completed.`);
            if( variant_playlists.length == resolutions.length )
            {
                createMasterPlaylist(masterPlaylistPath, variant_playlists);
            }
        });
    });
}

// const input_path = 'C:/Users/ECS/Desktop/hd_video.mp4'
const input_path = 'C:/Users/ECS/Desktop/game_thrones_sample_mini_2.mp4'

// const output_path = path.resolve(__dirname , '../public/output.mpd');
const output_dir = "C:/Users/ECS/Desktop/NODE_LEARN/VIDEO_STREAMING_1/src/public"

convertVideoToHLS(input_path, output_dir );

// read_dir() ;

function read_dir()
{
    let files =fs.readdirSync( output_dir);

    for(let file of files)
    {
        console.log( file );
    }
}