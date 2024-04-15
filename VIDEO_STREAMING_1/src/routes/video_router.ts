import { Request , Response } from 'express';
import express from 'express'
import { upload_wrapper } from '../middlewares/upload_wrapper';
import { Video_Controller } from '../controllers/video_controller';
import { check_user_attached_with_video } from '../middlewares/video_utils'
import  path from 'path'
let router = express.Router();

let video_controller = new Video_Controller();

router.post('/add', upload_wrapper, video_controller.add_video );

router.get( '/temp' , ( req, res, next)=>
{
    console.log( 'checking ');
    res.send('temp');
})

router.get('/file' ,( req, res , next)=>
{
    res.sendFile(path.join(__dirname, 'video_4.html'))
})

router.get ('/',check_user_attached_with_video  ,video_controller.stream_video);


router.get('/stream', video_controller.stream_demo_video)

router.get('/hls', ( req, res, next)=>
{
    res.sendFile(path.join(__dirname ,'video_2.html'))
} )

export { router }