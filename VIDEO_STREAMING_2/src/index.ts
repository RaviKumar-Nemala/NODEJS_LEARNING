import { NextFunction, Request , Response } from 'express';
import express from 'express'
import { AppDataSource } from './config/db_config';
import bodyParser from 'body-parser';
import { router as user_router} from './routes/user_router'
import { router as video_router} from './routes/video_router'
import cookieParser from 'cookie-parser'
import path from  'path'

const app   = express();

app.use( bodyParser.json() );
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use( express.static(path.join(__dirname, 'public')) )



app.use('/user' , user_router);

app.use('/video' , video_router);

app.use('/' , (req:Request,res:Response,next:NextFunction)=>
{
    console.log( req.url);
    next();
})
app.use( ( err:any, req:Request, res:Response, next:NextFunction )=> 
{
    console.log( err );
    console.log( 'ERROR HANDLER called');
    let { message , statusCode , status } = err;
    return res.status( statusCode || 500 ).json (
        {
        status : status || 'fail',
        statudCode : statusCode || 500,
        message : message ||'something went wrong'
        }
    );
})


AppDataSource.initialize().then(()=>{
    console.log( 'CONNTECTED TO THE DATABASE')
app.listen( 3000 , ()=>
{
    console.log( 'SERVER LISTENING ON THE PORT 3000');
})
}).catch ( ( err )=>
{
    console.log('FALILED WHILE CONNECTING TO THE DATABASE')
}
)