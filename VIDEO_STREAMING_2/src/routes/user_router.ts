import {Request , Response , NextFunction} from 'express';
import express from 'express';
import { User_Controller } from '../controllers/user_controller';
const router = express.Router();
let user_controller= new User_Controller ();

router.post('/add',  user_controller.add_user );

router.get('/:username', user_controller.get_user)

export  {router};