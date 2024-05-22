import {Request , Response , NextFunction} from 'express';
import express from 'express';
import { Video_Controller } from '../controllers/video_controller';
const router = express.Router();

const video_controller= new Video_Controller();

router.post('/get_upload_url' , video_controller.get_upload_url)

router.post('/create_mux_asset',video_controller.create_mux_asset);

router.post('/get_object_signed_url', video_controller.get_object_signed_url);

router.post( '/get_object_signed_cookies',video_controller.get_object_signed_cookies);

router.post('/upload_direct', video_controller.upload_direct);

router.get('/stream_init' , video_controller.stream_init);

router.get('/start_hls_stream/:folder_name/:file_name', video_controller.start_hls_stream);

router.get('/stream_sample_video', video_controller.stream_sample_video);

router.delete('/object', video_controller.delete_s3_object);

// router.delete('/folder/:folder_name')

export {router} 

