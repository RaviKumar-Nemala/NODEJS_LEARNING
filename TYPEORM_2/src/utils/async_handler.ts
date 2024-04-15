import { Request , Response , NextFunction } from 'express';


export let async_handler = ( fn : Function)=> { return ( req : Request,res : Response , next : NextFunction )=> fn(req,res).catch ((err : any)=>{next(err)}) };
