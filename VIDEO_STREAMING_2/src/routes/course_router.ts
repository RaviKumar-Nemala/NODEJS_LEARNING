import express from 'express';
import{ Course_Controller } from '../controllers/course_controller'
const router = express.Router();
let course_controller = new Course_Controller();
router.get('/create_course' , course_controller.create_course);

