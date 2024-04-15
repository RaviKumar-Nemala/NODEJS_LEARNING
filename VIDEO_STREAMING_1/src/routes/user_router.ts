import express , {Request ,Response,NextFunction} from 'express'
import { User_Controller } from '../controllers/user_controller'
import { authenticate , check_credentials } from '../middlewares/login_utils'
import { Course_Controller } from '../controllers/course_controller'

let router = express.Router();

function send_courses (  req :Request , res : Response, next :NextFunction)
{
    return res.json(  req.user);
}
let user_controller = new User_Controller();
let course_controller = new Course_Controller();

router.post ( '/add' , user_controller.add_user);

router.post('/add_to_course' , user_controller.link_to_course);

router.post( '/login' , authenticate );

router.get('/get_courses' , check_credentials,course_controller.send_courses);

export { router};