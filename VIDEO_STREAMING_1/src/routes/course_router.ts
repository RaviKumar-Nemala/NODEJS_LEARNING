import { Request , Response } from 'express';
import express from 'express'
import { Course_Controller } from '../controllers/course_controller';
import{ async_handler} from '../utils/async_handler';
import { check_user_linked_with_course} from '../middlewares/login_utils'

let router = express.Router();

let course_controller = new Course_Controller();

router.post('/add',(course_controller.add_course) ); 

router.get('/get_course' , check_user_linked_with_course , course_controller.send_course_info);

export {router as course_router};