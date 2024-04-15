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
        const outputFilename = `${outputDir}/${master_id}#${height}p.m3u8`;

        const ffmpegCommand = `ffmpeg -i ${inputFile} \
            -vf "scale=${width}:${height}:force_original_aspect_ratio=decrease" \
            -c:a aac -b:a 128k -ar 48000 \
            -c:v h264 -profile:v main -crf 20 -g 48 -keyint_min 48 \
            -sc_threshold 0 -b:v ${bitrate} -maxrate ${bitrate} \
            -hls_time 10 -hls_playlist_type vod -hls_segment_filename ${outputDir}/${master_id}#${height}p_%03d.ts \
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

// "scale=1280:720",
//     "scale=640:320",
//     "scale=1920:1080",
//     "scale=854:480",
//     "scale=600:240"
// Define video renditions (resolutions and bitrates)
// const renditions = [
//     {resulution : '600:240' , bitrate :'500k'},
//     { resolution: '640:320', bitrate: '800k' },
//     { resolution: '854:480', bitrate: '1400k' },
//     { resolution: '1280:720', bitrate: '2800k' },
//     {resolution : '1920:1080' , bitrate : '4000k'}
// ];

// let inputFilePath = 'C:/Users/ECS/Desktop/game_thrones_sample_mini.mp4'
// let outputDir = "C:/Users/ECS/Desktop/NODE_LEARN/VIDEO_STREAMING_1/src/public"
// // Process each rendition
// renditions.forEach((rendition, index) => {
//     const { resolution, bitrate } = rendition;

//     // Output folder for this rendition
//     const outputFolder = path.join(outputDir, `rendition_${index}/`);
//     // HLS playlist file path for this rendition
//     const playlistPath = path.join(outputFolder, `${resolution?.split(':').at(1)}.m3u8`);

//     // Run ffmpeg command to generate HLS segments and playlist
//     ffmpeg(inputFilePath)
//         .addOption('-vf', `scale=-2:${resolution?.split(':')[1]}`)
//         .addOption('-b:v', bitrate)
//         .addOption('-c:a', 'aac')
//         .addOption('-preset', 'fast')
//         .addOption('-profile:v', 'main')
//         .addOption('-hls_time', '10')
//         .addOption('-hls_list_size', '0')
//         .addOption('-hls_segment_filename', `${outputFolder}segment_%03d.ts`)
//         .output(playlistPath)
//         .on('error', (err:any) => {
//             console.error(`Error converting ${resolution}: ${err.message}`);
//         })
//         .on('end', () => {
//             console.log(`Conversion of ${resolution} complete`);
//         })
//         .run();
// });


// Usage example
// const input_path = 'C:/Users/ECS/Desktop/game_thrones_sample_mini_2.mp4'

const input_path = 'C:/Users/ECS/Desktop/hd_video.mp4'

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