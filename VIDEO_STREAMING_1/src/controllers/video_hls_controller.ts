import ffmpegPath from "ffmpeg-static";
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'

if ( ffmpegPath != null)
ffmpeg.setFfmpegPath(ffmpegPath)


const input_path = 'C:/Users/ECS/Desktop/game_thrones_sample_mini.mp4'

// const output_path = path.resolve(__dirname , '../public/output.mpd');
const output_path = "../public/output.m3u8";

console.log( output_path)
const scaleOptions = [
    "scale=1280:720",
    "scale=640:320",
    "scale=1920:1080",
    "scale=854:480",
    "scale=600:240"
]

const videoCodec = "libx264"

const x264Options = "keyint=24:min-keyint=24:no-scenecut"

const videoBitrates = ['500K','100K','2000K']

try{
ffmpeg()
.input(input_path)
.videoFilters(scaleOptions)
.videoCodec(videoCodec)
.addOption("-x264opts",x264Options)
.outputOptions("-b:v",videoBitrates[0])
.format('dash')
.output(output_path)
.on('end' , ()=>
{
    console.log( 'DASH ENCODING COMPLETED')
})
.run()
}
catch ( err )
{
    console.log(err)
}